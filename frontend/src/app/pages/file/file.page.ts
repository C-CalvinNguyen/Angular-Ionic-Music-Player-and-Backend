import { Component, OnInit } from '@angular/core';

// Imported Packages
import { Capacitor } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';

import { DatabaseService } from '../../services/database/database.service';

import * as jsmediatagsType from '../../../../node_modules/@types/jsmediatags';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

const jsmediatags = (window as any).jsmediatags as typeof jsmediatagsType;

const APP_DIRECTORY = Directory.Documents;

@Component({
  selector: 'app-file',
  templateUrl: './file.page.html',
  styleUrls: ['./file.page.scss'],
})
export class FilePage implements OnInit {

  // Variables
  // Used to show content, will contain folder name, files, subfolders
  folderContent = [];
  // String path of current folder
  currentFolder = '';

  constructor(private route: ActivatedRoute, private router: Router, private file: File,
    private db: DatabaseService, private alertCtrl: AlertController, private loadingController: LoadingController) { }

  // Lifecycle hook when page opens
  ngOnInit() {

    // Get current folder from parameter 'folder' else blank
    this.currentFolder = this.route.snapshot.paramMap.get('folder') || '';

    // Load documents of the current directory
    this.loadDocuments();
  }

  /*
    loadDocuments() Method
  */
  async loadDocuments() {

    // Gets Content From current directory using Filesystem readdir
    const folderContent = await Filesystem.readdir({
      directory: APP_DIRECTORY,
      path: this.currentFolder
    });

    // readdir returns an array of strings, we will return the filename and get stat info
    // Goes through the array of strings, returns an object with name, and filesystem stat (type and uri path)
    this.folderContent = await Promise.all(folderContent.files.map(async file => {
      const toReturn = {
        name: file,
        direc: this.currentFolder,
        stat: await Filesystem.stat({
          directory: APP_DIRECTORY,
          path: this.currentFolder + '/' + file
        })
      };
      return toReturn;
    }));
  }

  /*
    itemClicked() Method
    When user clicks on a folder, it opens to that folder
  */
  async itemClicked(entry: any) {
    console.log('hello item clicked');
    console.log('directory ', entry);
      // Open the file or folder
      if (entry.stat.type === 'file' || entry.stat.type === 'NSFileTypeRegular') {

      } else {
        const pathToOpen =
          this.currentFolder !== '' ? this.currentFolder + '/' + entry.name : entry.name;
        const folder = encodeURIComponent(pathToOpen);
        this.router.navigateByUrl(`/file/${folder}`);
      }
  }

  /*
    scanForAudio() Method
    When user clicks plus fab button -> scan current folder and all subfolders for audio files
  */
  async scanForAudio(folderContent: any, currentFolder) {

    let tempCurrentFolder = '';
    if (currentFolder === '') { tempCurrentFolder = 'Documents'; }

    this.db.deleteAllData().then(() => {console.log('Database Data Deleted');});

    const loading = await this.loadingController.create({});

    await this.scan(currentFolder, folderContent)
    .then(async (temp) => {

      loading.present();

      console.log(temp);

      for (const tempFile of temp) {

        // Convert a device filepath into a Web View-friendly path.
        const fileUrl = Capacitor.convertFileSrc(tempFile.stat.uri);
        console.log(fileUrl);

        // Pass url to jsmediatags
        jsmediatags.read(fileUrl, {
          onSuccess: (tags) => {
            console.log('Tags Found');
            console.log(tags.tags);

            const tempTitle = (
              tags.tags.title === undefined || tags.tags.title.trim() === ''
              ) ? this.getTitle(tempFile.name) : tags.tags.title;

            const tempArtist = (
              tags.tags.artist === undefined || tags.tags.artist.trim() === ''
            ) ? 'No Artist' : tags.tags.artist;

            const tempAlbum = (
              tags.tags.album === undefined || tags.tags.album.trim() === ''
            ) ? 'No Album' : tags.tags.album;

            const tempGenre = (
              tags.tags.genre === undefined || tags.tags.genre.trim() === ''
            ) ? 'No Genre' : tags.tags.genre;

            const tempSource = tempFile.stat.uri;
            const tempSourceType = 'offline';
            const tempOnlineId = '';

            this.db.addSong(tempTitle, tempArtist, tempAlbum, tempGenre, tempSource, tempSourceType, tempOnlineId).then(
              () => console.log(`Successful Insert of ${tempTitle} WITH TAGS`)
            );
          },
          onError: (error) => {
            console.log('Invalid || NO TAGS');
            console.log(error);

            const tempTitle = this.getTitle(tempFile.name);
            const tempArtist = 'No Artist';
            const tempAlbum = 'No Album';
            const tempGenre = 'No Genre';
            const tempSource = tempFile.stat.uri;
            const tempSourceType = 'offline';
            const tempOnlineId = '';

            this.db.addSong(tempTitle, tempArtist, tempAlbum, tempGenre, tempSource, tempSourceType, tempOnlineId).then(
              () => console.log(`Successful Insert of ${tempTitle} WITHOUT TAGS`)
            );
          }
        });
      }

      loading.dismiss();

    });
  }

  /*
    getTitle() Method
    If no tags are found set the name as the title
  */
  getTitle(inputTitle: string) {
    let tempTitle: string;
    const tempTitleArray = inputTitle.split('.');
    if (tempTitleArray.length >= 3) {
      tempTitleArray.pop();
      tempTitle = tempTitleArray.join('.');
    } else {
      tempTitleArray.pop();
      tempTitle = tempTitleArray[0];
    }
    return tempTitle;
  }

  /*
    isAudioType() Method
    Checks the file extension
  */
  isAudioType(type: string) {
    const fileType = type.toLowerCase();
    if (fileType === 'wav') {
      return true;
    }
    if (fileType === 'mp3') {
      return true;
    }
    if (fileType === 'flac') {
      return true;
    }
    if (fileType === 'ogg') {
      return true;
    }
    if (fileType === 'aac') {
      return true;
    }
    return false;
  }

  /*
    scan() Method
    // Create Recursive Scan Function
    // If it finds mp3/wav/ogg file -> Add file to storage with directory path
    // If it finds folder -> Call Recursive Scan Function On the Folder
  */
  async scan(currentFolder: any, folderArray: any) {
    const toReturn = [];

    // Go Through the Current Folder Array
    for (const file of folderArray) {
      const ext = file.stat.uri.split('.').pop();

      if((file.stat.type === 'file' || file.stat.type === 'NSFileTypeRegular') && this.isAudioType(ext)) {
        toReturn.push(file);
      }
      if(file.stat.type === 'directory' || file.stat.type === 'NSFileTypeDirectory') {
        await this.getDocuments(`${currentFolder}/${file.name}`)
        .then(async (data) => {

          //console.log(data);

          // push with spread operator
          toReturn.push(...await this.scan(`${currentFolder}/${file.name}`, data));
        });
      }
    }
    //console.log({message: 'array to be returned', toReturn});
    return toReturn;
  }

  /*
    getDocuments() method
    like loadDocuments, gets all the files and folder of the given folder path
  */
  async getDocuments(folderDir: any) {

    let returnArray = [];

    const folderContent = await Filesystem.readdir({
      directory: APP_DIRECTORY,
      path: folderDir
    });

    returnArray = await Promise.all(folderContent.files.map(async file => {
      const toReturn = {
        name: file,
        direc: folderDir,
        stat: await Filesystem.stat({
          directory: APP_DIRECTORY,
          path: folderDir + '/' + file
        })
      };
      return toReturn;
    }));

    return returnArray;
  }

  async scanAlert(folderContent: any, currentFolder: any) {
    const alert = await this.alertCtrl.create({
      header: 'Scan Folder',
      message: 'Do you want to scan this directory? Doing so will delete current database info.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Scan',
          handler: async () => {
            await this.db.deleteAllData()
            .then(() => {
              console.log('Database Data Deleted');
              this.scanForAudio(folderContent, currentFolder);
            });
          }
        }
      ]
    });

    alert.present();
  }
}

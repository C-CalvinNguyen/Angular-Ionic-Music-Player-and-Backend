/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { SharePlaylistModalComponent } from 'src/app/components/share-playlist-modal/share-playlist-modal.component';
import { Song } from 'src/app/models/song.model';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-share-playlist',
  templateUrl: './share-playlist.page.html',
  styleUrls: ['./share-playlist.page.scss'],
})
export class SharePlaylistPage implements OnInit {

  // Variables used
  // displayList has the list of playlists
  displayList = [];
  // selectPlaylist has the ID of the playlist the user has selected to share
  selectPlaylist = {id: ''};

  constructor(
    private router: Router,
    private db: DatabaseService,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  // Get content from the backend
  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        // Get Playlists
        this.loadContent();

      }
    });
  }

  // Used to get content from backend
  async loadContent() {
    this.db.getPlaylists().subscribe(data => this.displayList = data);
  }

  // Creates modal and passes the playlist (array of ONLINE songs) to the modal
  async sharePlaylist(index: number) {

    const modal = await this.modalController.create({
      component: SharePlaylistModalComponent
    });

    const toast = await this.toastController.create({
      message: 'No Online Songs in Playlist',
      duration: 2000
    });

    const tempPlaylist = this.displayList[index];

    this.db.getOnlineSongsByPlaylist(tempPlaylist.id).then(async data => {
      if (data.length > 0) {
        modal.componentProps = {inputSongList: data, playlistTitle: tempPlaylist.title};

        await modal.present();

      } else {
        await toast.present();
      }
    });

    modal.onDidDismiss().then((data: any) => {

      if (data.data === undefined) {

      } else {
        if(data.data.success === true) {
          this.router.navigate(['mainapp']);
        }
      }
    });
  }

}

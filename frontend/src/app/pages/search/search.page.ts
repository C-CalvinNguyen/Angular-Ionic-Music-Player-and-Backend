/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SongDataService } from 'src/app/services/songData/song-data.service';
import { TOKEN_KEY } from 'src/app/constants';
import { Storage } from '@ionic/storage';
import { BACKEND_ANDROID_SERVER } from 'src/app/constants';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  /*
    Variables used
    searchForm is a FormGroup with the searchText and condition
  */
  searchForm = new FormGroup({
    searchText: new FormControl(),
    searchCondition: new FormControl()
  });

  // searchContent contains the content returned from the search
  searchContent: any[] = [];

  constructor(private toastCtrl: ToastController, private songDataService: SongDataService,
    private router: Router, private storage: Storage) { }

  ngOnInit() {
  }

  // search() method picks which backendURL to search (by title, artist, genre)
  search() {

    // get JWT from local storage
    let tempJWT = '';
    this.storage.get(TOKEN_KEY).then(data => {

      tempJWT = data.toString();
      let tempSearch = this.searchForm.get('searchText').value;
      let tempCondition = this.searchForm.get('searchCondition').value;

      // iF temp search and condition are null DEFAULT to teampSearch = '' and tempCondition = 'title'
      if (tempCondition === null) {
        tempCondition = 'title';
      }

      if (tempSearch === null) {
        tempSearch = '';
      }

      let url = '';

      // checks which condition is selected and passes the appropriate URL
      switch (tempCondition) {
        case 'title':
          url = `${BACKEND_ANDROID_SERVER}/song/search/title?title=${tempSearch}`;
          this.callSearch(url, tempJWT);
          break;

        case 'genre':
          url = `${BACKEND_ANDROID_SERVER}/song/search/genre?genre=${tempSearch}`;
          this.callSearch(url, tempJWT);
          break;

        case 'artist':
          url = `${BACKEND_ANDROID_SERVER}/song/search/artist?artist=${tempSearch}`;
          this.callSearch(url, tempJWT);
          break;
      }
    });
  }


  // calls the backend URL endpoint for a list of songs matching the condition
  callSearch(url, jwt) {

    try {

      fetch(url, {
        method: 'GET',
        headers: new Headers ({
          'Authorization': `Bearer ${jwt}`
        })
      }).then(res => {
        res.json().then(async json => {

          if (json.songsFind.length === 0) {
            const toast = await this.toastCtrl.create({
              message: 'No Songs Found',
              duration: 2000
            });

            toast.present();
          } else {
            const toast = await this.toastCtrl.create({
              message: json.message,
              duration: 2000
            });

            this.searchContent = json.songsFind;

            toast.present();
          }
        }).catch((err) => {
          console.log(err);
        });
      });

    } catch (err) {
      console.log(err);
    }

  }

  selectSong(index: any) {

    const tempSong = [{
      title: this.searchContent[index].title,
      artist: this.searchContent[index].artist,
      sourceType: this.searchContent[index].sourceType,
      // eslint-disable-next-line no-underscore-dangle
      source: `${BACKEND_ANDROID_SERVER}/song/stream?s=${this.searchContent[index]._id.toString()}&b=320&f=mp3`,
      // eslint-disable-next-line no-underscore-dangle
      onlineId: `${this.searchContent[index]._id.toString()}`
    }];

    this.songDataService.setFiles(tempSong);
    this.router.navigate(['/player/']);
  }

}

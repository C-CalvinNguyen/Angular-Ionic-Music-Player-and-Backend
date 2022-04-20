/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BACKEND_ANDROID_SERVER, TOKEN_KEY } from 'src/app/constants';
import { SongDataService } from 'src/app/services/songData/song-data.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-get-playlist',
  templateUrl: './get-playlist.page.html',
  styleUrls: ['./get-playlist.page.scss'],
})
export class GetPlaylistPage implements OnInit {

  // Variables used (form for playlist id from a playlist in the backend)
  getPlaylistForm = new FormGroup({
    id: new FormControl()
  });

  constructor(private router: Router, private songDataService: SongDataService,
    private toastController: ToastController, private storage: Storage) { }

  ngOnInit() {
  }

  // getPlaylist() method, get Playlist ID from form, fetch from backend
  // present toast if unsuccessful, pass data to player if successful
  async getPlaylist() {

    // Get ID from form
    const tempId = this.getPlaylistForm.get('id').value;

    // If ID is empty string or null present toast error
    if (tempId === null || tempId.replace(/\s/g, '') === '') {
      const toast = await this.toastController.create({
        message: 'Please input an ID',
        duration: 3000
      });

      await toast.present();
    } else {

      // get JWT from local storage
      this.storage.get(TOKEN_KEY).then(async data => {
        const jwt = data.toString();

        // backend URL endpoint
        const playlistUrl = `${BACKEND_ANDROID_SERVER}/playlist?id=${tempId}`;

        // fetch backend
        fetch(playlistUrl, {
          method: 'GET',
          headers: new Headers({
            // eslint-disable-next-line quote-props
            'Authorization': `Bearer ${jwt}`
          })
        })
        .then(async res => {

          // If successful (200) pass data to player using songDataService
          if(res.status === 200) {
            res.json().then(json => {
              this.songDataService.setFiles(json.playlist.list);
              this.router.navigate(['/player/']);
            });
          } else {

            // if unsuccessful present toast with error message
            const errorToast = await this.toastController.create({
              message: 'Error Getting Playlist Or Not Found',
              duration: 3000
            });

            await errorToast.present();
          }
        });

      });

    }

  }

}

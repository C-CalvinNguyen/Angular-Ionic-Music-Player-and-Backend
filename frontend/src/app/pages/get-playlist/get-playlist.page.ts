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

  getPlaylistForm = new FormGroup({
    id: new FormControl()
  });

  constructor(private router: Router, private songDataService: SongDataService,
    private toastController: ToastController, private storage: Storage) { }

  ngOnInit() {
  }

  async getPlaylist() {

    const tempId = this.getPlaylistForm.get('id').value;

    if (tempId === null || tempId.replace(/\s/g, '') === '') {
      const toast = await this.toastController.create({
        message: 'Please input an ID',
        duration: 3000
      });

      await toast.present();
    } else {

      this.storage.get(TOKEN_KEY).then(async data => {
        const jwt = data.toString();

        const playlistUrl = `${BACKEND_ANDROID_SERVER}/playlist?id=${tempId}`;

        fetch(playlistUrl, {
          method: 'GET',
          headers: new Headers({
            // eslint-disable-next-line quote-props
            'Authorization': `Bearer ${jwt}`
          })
        })
        .then(async res => {
          if(res.status === 200) {
            res.json().then(json => {
              this.songDataService.setFiles(json.playlist.list);
              this.router.navigate(['/player/']);
            });
          } else {
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

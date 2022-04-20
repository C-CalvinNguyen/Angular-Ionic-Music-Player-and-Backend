/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BACKEND_ANDROID_SERVER, TOKEN_KEY } from 'src/app/constants';
import { SongInfoService } from 'src/app/services/songInfo/song-info.service';
import { Storage } from '@ionic/storage';

import { FormGroup, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.page.html',
  styleUrls: ['./edit-song.page.scss'],
})
export class EditSongPage implements OnInit {

  // Variables used
  song: any = {title: 'test'};
  avgRating: 0;
  editForm: FormGroup;

  // Get the song from the songInfoService, and set the editForm group with defaults to the song properties
  constructor(private router: Router, private songInfoService: SongInfoService,
    private storage: Storage, private toastCtrl: ToastController) {
    this.songInfoService.getFiles().subscribe(data => {
      this.song = data;

      this.editForm = new FormGroup({
        title: new FormControl(this.song.title),
        artist: new FormControl(this.song.artist),
        genre: new FormControl(this.song.genre)
      });
    });

    // Call methods for more information
    this.getAvgRating();
    this.getSongImage();
  }

  ngOnInit() {
  }

  // getAvgRating() method calls backend for information on song rating
  getAvgRating() {

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const tempId = this.song['_id'].toString();

    fetch(`${BACKEND_ANDROID_SERVER}/rating/avg?songId=${tempId}`,
      {})
      .then(res => {
        res.json().then(json => {
          this.avgRating = json.avg;
        });
      });

  }

  // getSongImage() method calls backend for information on song image
  getSongImage() {

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const tempId = this.song['_id'].toString();

    fetch(`${BACKEND_ANDROID_SERVER}/song/image?id=${tempId}`, {})
    .then((res) => {
      res.blob().then(blob => {
        const imgUrl = URL.createObjectURL(blob);
        this.song.image = imgUrl;
      });
    })
    .catch(err => {
      console.error(err);
    });

  }

  /*
    editSong() method gets the new title, artist or genre from the form
    and sends this updated information to the backend
  */
  editSong() {

    let tempTitle = this.editForm.get('title').value;
    let tempArtist = this.editForm.get('artist').value;
    let tempGenre = this.editForm.get('genre').value;

    if (tempTitle === null || tempTitle.replace(/\s/g, '') === '') {
      tempTitle = this.song.title;
    }

    if (tempArtist === null || tempArtist.replace(/\s/g, '') === '') {
      tempArtist = this.song.artist;
    }

    if (tempGenre === null || tempGenre.replace(/\s/g, '') === '') {
      tempGenre = this.song.genre;
    }

    // backend URL endpoint
    // eslint-disable-next-line no-underscore-dangle
    const editUrl = `${BACKEND_ANDROID_SERVER}/song/edit/${this.song._id}`;

    // get JWT token from local storage
    this.storage.get(TOKEN_KEY).then(data => {
      const tempJwt = data.toString();

      if (tempJwt === 'jwt-token' || tempJwt === '') {

      } else {

        // fetch backend with new information
        fetch(editUrl, {
          method: 'POST',
          headers: new Headers({
            // eslint-disable-next-line quote-props
            'Authorization': `Bearer ${tempJwt}`,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({title: tempTitle, artist: tempArtist, genre: tempGenre})
        })
        .then(async res => {

          // If successful present toast to user
          if (res.status === 200) {
            const toast = await this.toastCtrl.create({
              message: 'Song Updated',
              duration: 2000
            });

            toast.present();

            this.router.navigate(['account']);

          }
        });

      }

    });
  }

}

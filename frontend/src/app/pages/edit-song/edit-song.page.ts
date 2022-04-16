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

  song: any = {title: 'test'};
  avgRating: 0;

  editForm: FormGroup;

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

    this.getAvgRating();
    this.getSongImage();
  }

  ngOnInit() {
    console.log(this.song);
  }

  getAvgRating() {

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const tempId = this.song['_id'].toString();

    fetch(`${BACKEND_ANDROID_SERVER}/rating/avg?songId=${tempId}`,
      {})
      .then(res => {
        res.json().then(json => {
          this.avgRating = json.avg;
          console.log(this.avgRating);
        });
      });

  }

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

  editSong() {

    console.log(this.editForm.get('title').value);
    console.log(this.editForm.get('artist').value);
    console.log(this.editForm.get('genre').value);

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

    console.log(this.song);

    // eslint-disable-next-line no-underscore-dangle
    const editUrl = `${BACKEND_ANDROID_SERVER}/song/edit/${this.song._id}`;

    this.storage.get(TOKEN_KEY).then(data => {
      const tempJwt = data.toString();

      if (tempJwt === 'jwt-token' || tempJwt === '') {

      } else {

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

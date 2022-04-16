/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { BACKEND_ANDROID_SERVER, TOKEN_KEY } from 'src/app/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { SongInfoService } from 'src/app/services/songInfo/song-info.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: any = {};
  userSongs: any = [];

  constructor(private authService: AuthService, private storage: Storage, private router: Router,
    private songInfoService: SongInfoService) {

    this.user = this.authService.getUser();
    console.log(this.user);

    this.getUserSongs();
   }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getUserSongs();
  }

  getUserSongs() {
    try {

      this.storage.get(TOKEN_KEY).then(data => {
        const tempJWT = data.toString();

        fetch(`${BACKEND_ANDROID_SERVER}/song/userSongs`, {
          method: 'GET',
          headers: new Headers({
            // eslint-disable-next-line quote-props
            'Authorization': `Bearer ${tempJWT}`
          })
        }).then(res => {
          res.json().then(async json => {
            this.userSongs = json;
            console.log(this.userSongs);
          });
        });
      });

    } catch (err) {
      console.error(err);
    }
  }

  editSong(index: any) {

    const tempSong = this.userSongs[index];

    this.songInfoService.setFiles(tempSong);

    this.router.navigate(['edit-song']);
  }

  deleteAccount() {

  }

}

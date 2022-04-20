/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { BACKEND_ANDROID_SERVER, TOKEN_KEY } from 'src/app/constants';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Storage } from '@ionic/storage';
import { NavigationExtras, Router } from '@angular/router';
import { SongInfoService } from 'src/app/services/songInfo/song-info.service';
import { AlertController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  // Variables Used
  // User is the logged in user
  user: any = {};
  // User songs is used to display a list of the users songs
  userSongs: any = [];

  // constructor, get user from authService
  constructor(private authService: AuthService, private storage: Storage, private router: Router,
    private songInfoService: SongInfoService, private alertController: AlertController,
    private toastController: ToastController) {

    this.user = this.authService.getUser();
    console.log(this.user);

    // Call getUserSongs method
    this.getUserSongs();
   }

  ngOnInit() {
  }

  // Update user songs
  ionViewDidEnter() {
    this.getUserSongs();
  }

  // getUserSongs() method calls song list from the backend
  getUserSongs() {
    try {

      // get JWT from local storage
      this.storage.get(TOKEN_KEY).then(data => {
        const tempJWT = data.toString();

        // fetch list of songs from backend
        fetch(`${BACKEND_ANDROID_SERVER}/song/userSongs`, {
          method: 'GET',
          headers: new Headers({
            // eslint-disable-next-line quote-props
            'Authorization': `Bearer ${tempJWT}`
          })
        }).then(res => {
          // set userSongs as the songs list from json
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

  // navigate to editSong page and passes the song using a service
  editSong(index: any) {

    const tempSong = this.userSongs[index];

    this.songInfoService.setFiles(tempSong);

    this.router.navigate(['edit-song']);
  }

  // deleteAccount() method messages and asks user for password using alert
  // if password matches logout user, and user is deleted from backend
  async deleteAccount() {

    const alert = await this.alertController.create({
      header: 'Delete Account',
      subHeader: 'Are you sure you want to delete your account?',
      message: 'Please enter your password.',
      inputs: [
        {
          name: 'password',
          type: 'password',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');

            const tempPassword = data.password;

            // get JWT from local storage
            this.storage.get(TOKEN_KEY).then(jwtData => {
              const tempJWT = jwtData.toString();

              // call delete endpoint in backend
              fetch(`${BACKEND_ANDROID_SERVER}/account/delete`, {
                method: 'DELETE',
                headers: new Headers({
                  // eslint-disable-next-line quote-props
                  'Authorization': `Bearer ${tempJWT}`,
                  'Content-Type': 'application/json'
                }),
                body: JSON.stringify({password: tempPassword})
              })
              .then(async res => {

                // if successful logout in client
                if (res.status === 200) {

                  this.authService.logout();
                  this.router.navigate(['home']);

                } else {

                  // if unsucessful send toast to user
                  const toast = await this.toastController.create({
                    message: 'Error: Password does not match',
                    duration: 2000
                  });

                  await toast.present();
                }
              });

            });

          }
        }
      ]
    });

    // Present alert to user
    await alert.present();

  }

}

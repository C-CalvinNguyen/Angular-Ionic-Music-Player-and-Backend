/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TOKEN_KEY, BACKEND_ANDROID_SERVER } from 'src/app/constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  credentials = {
    oldPassword: '',
    newPassword: ''
  };

  constructor(private router: Router, private storage: Storage,
    private authService: AuthService, private toastController: ToastController, private alertController: AlertController) { }

  ngOnInit() {
  }

  async updatePassword() {

    const alert = await this.alertController.create({
      header: 'Edit Account',
      subHeader: 'This will log you out',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'OK',
          role: 'OK',
          handler: async () => {

            this.storage.get(TOKEN_KEY).then(data => {
              const jwt = data.toString();

              const passwordUrl = `${BACKEND_ANDROID_SERVER}/account/update/password`;

              fetch(passwordUrl, {
                method: 'POST',
                  headers: new Headers({
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                  }),
                  body: JSON.stringify({oldPassword: this.credentials.oldPassword, newPassword: this.credentials.newPassword})
              })
              .then(async res => {
                if (res.status === 200) {
                  this.authService.logout();
                  this.router.navigate(['/home']);
                }
                else if (res.status === 400) {
                  const toast = await this.toastController.create({
                    message: 'Password does not match',
                    duration: 3000
                  });

                  await toast.present();

                } else {
                  const toast2 = await this.toastController.create({
                    message: 'Error updating password',
                    duration: 3000
                  });

                  await toast2.present();

                }
              });
            });

          }
        }
      ]
    });

    await alert.present();
  }

}

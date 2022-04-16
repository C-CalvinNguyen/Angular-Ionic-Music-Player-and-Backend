/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TOKEN_KEY, BACKEND_ANDROID_SERVER } from 'src/app/constants';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {

  credentials = {
    username: 'temp',
    email: 'temp@email.com'
  };

  constructor(private storage: Storage, private router: Router,
    private authService: AuthService, private alertController: AlertController,
    private toastController: ToastController) { }

  ngOnInit() {
  }

  async updateAccount() {

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

                const editUrl = `${BACKEND_ANDROID_SERVER}/account/update/info`;

                fetch(editUrl, {
                  method: 'POST',
                  headers: new Headers({
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                  }),
                  body: JSON.stringify({username: this.credentials.username, email: this.credentials.email})
                })
                .then(async res => {
                  if (res.status === 200) {
                    this.authService.logout();
                    this.router.navigate(['/home']);
                  } else {

                    const toast = await this.toastController.create({
                      message: 'Error Updating Info',
                      duration: 3000
                    });

                    await toast.present();
                  }
                });

              });
            }
          },
        ]
      });

      await alert.present();
  }

}

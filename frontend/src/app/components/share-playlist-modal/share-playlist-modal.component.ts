/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TOKEN_KEY, BACKEND_ANDROID_SERVER } from 'src/app/constants';

@Component({
  selector: 'app-share-playlist-modal',
  templateUrl: './share-playlist-modal.component.html',
  styleUrls: ['./share-playlist-modal.component.scss'],
})
export class SharePlaylistModalComponent implements OnInit {

  @Input() inputSongList: any;
  @Input() playlistTitle: any;

  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private alertController: AlertController,
    private toastController: ToastController
  ) { console.log('Share Playlist Modal Open'); }

  ngOnInit() {}

  uploadPlaylist() {

    this.storage.get(TOKEN_KEY).then(async data => {
      const jwt = data.toString();

      const playlistUrl = `${BACKEND_ANDROID_SERVER}/playlist/add`;

      fetch(playlistUrl, {
        method: 'POST',
        headers: {
          // eslint-disable-next-line quote-props
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({title: this.playlistTitle, list: this.inputSongList})
      })
      .then(async res => {
        if (res.status === 200) {
          res.json().then(async json => {

            const alert = await this.alertController.create({
              header: 'Playlist Uploaded',
              subHeader: 'Please write the playlist ID down',
              // eslint-disable-next-line @typescript-eslint/dot-notation
              message: `${json.tempPlaylist['_id'].toString()}`,
              buttons: ['OK']
            });

            await alert.present();
            alert.onDidDismiss().then(() => {
              this.modalController.dismiss({success: true});
            });
          });
        } else {

          const toast = await this.toastController.create({
            message: 'Error uploading playlist',
            duration: 3000
          });

          await toast.present();
        }
      });

    });
  }

}

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

  /*
    inputSongList is the playlist to add (online only)
    playlistTitle is the selected playlist title
  */
  @Input() inputSongList: any;
  @Input() playlistTitle: any;

  constructor(
    private modalController: ModalController,
    private storage: Storage,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {}

  // Called to upload playlist to backend
  uploadPlaylist() {

    // Gets JWT token from local storage
    this.storage.get(TOKEN_KEY).then(async data => {
      const jwt = data.toString();

      // Backend URL
      const playlistUrl = `${BACKEND_ANDROID_SERVER}/playlist/add`;

      // Fetch method (post, with JWT, passes array of songs)
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

        // If successful alert user and close modal
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

          // If failed send toast
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

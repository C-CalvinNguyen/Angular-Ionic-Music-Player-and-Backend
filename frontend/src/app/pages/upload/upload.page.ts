/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TOKEN_KEY } from 'src/app/constants';
import { Storage } from '@ionic/storage';
import { BACKEND_ANDROID_SERVER } from 'src/app/constants';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  // Variables used (audioChooser, and imageChooser are for files)
  @ViewChild('audioChooser', {static: true}) public audioChooserElementRef: ElementRef;
  @ViewChild('imageChooser', {static: true}) public imageChooserElementRef: ElementRef;
  audio: File;
  image: File;

  // FormGroup used for title, artist and genre FormControls
  uploadForm = new FormGroup({
    title: new FormControl(),
    artist: new FormControl(),
    genre: new FormControl(),
  });

  constructor(private router: Router, private loadingCtrl: LoadingController,
    private toastCtrl: ToastController, private storage: Storage) { }

  ngOnInit() {
    this.listenerAudioChange();
    this.listnerImageChange();
  }

  // uploadContent() sends the files and title, artist, genre information to the backend upload endpoint
  async uploadContent() {

    const loading = await this.loadingCtrl.create();

    loading.present();
    try {

        const fd = new FormData();

        if (this.image === undefined) {


          await fetch('assets/temp.jpg', {}).then((res) => {
            res.blob().then(blob => {

              const tempFile = new File([blob], 'temp.jpg', {type: 'image/jpg', lastModified: Date.now()});

              fd.append('image', tempFile);
            });
          });
        } else {
          fd.append('image', this.image[0]);
        }

        // Get JWT from local storage
        let tempJWT = '';
        this.storage.get(TOKEN_KEY).then(async data => {
          tempJWT = data.toString();


          // Adds all information to formdata which will be passed in the body
          fd.append('audio', this.audio[0]);

          const tempTitle = this.uploadForm.get('title').value;
          fd.append('title', tempTitle);

          const tempArtist = this.uploadForm.get('artist').value;
          fd.append('artist', tempArtist);

          const tempGenre = this.uploadForm.get('genre').value;
          fd.append('genre', tempGenre);

          const uploadUrl = `${BACKEND_ANDROID_SERVER}/song/add`;

          // fetch() to backend and passes formdata
          await fetch(uploadUrl, {
            method: 'POST',
            body: fd,
            headers: new Headers({
              'Authorization': `Bearer ${tempJWT}`
            }),
          }).then(async res => {

            // If successful navigate to home and present success toast
            loading.dismiss();
            if (res.status === 200) {
              const toast = await this.toastCtrl.create({
                message: `Status: ${res.status} 'Successful Upload'`,
                duration: 2000
              });
              toast.present();
              this.router.navigate(['/home']);
            }

            // If unsuccessful with code 415 pass unsupported media type toast
            else if (res.status === 415) {
              const toast = await this.toastCtrl.create({
                message: `Status: ${res.status} UNSUPPORTED MEDIA TYPE (WAV, MP3, OGG ONLY)`,
                duration: 2000
              });
              toast.present();
            } else {

              // present toast with error for any other error
              const toast = await this.toastCtrl.create({
                message: `Status: ${res.status} ERROR`,
                duration: 2000
              });
              toast.present();
            }
          }).catch(err => {
            loading.dismiss();
            console.log('Error', err);
          });

        });

      } catch (err) {
        loading.dismiss();
        console.log('Error', err);
      }
  }

  // Used to get audio file from input file type
  private listenerAudioChange() {
    const wireUpFileChooser = () => {
        const elementRef = this.audioChooserElementRef.nativeElement as HTMLInputElement;
        elementRef.addEventListener('change', (evt: any) => {
            const files = evt.target.files as File;
            this.audio = (files);
        }, false);
    };
    wireUpFileChooser();
  }

  // Used to get image file from input file type
  private listnerImageChange() {
    const wireUpFileChooser = () => {
        const elementRef = this.imageChooserElementRef.nativeElement as HTMLInputElement;
        elementRef.addEventListener('change', (evt: any) => {
            const files = evt.target.files as File;
            this.image = (files);
        }, false);
    };
    wireUpFileChooser();
  }

}

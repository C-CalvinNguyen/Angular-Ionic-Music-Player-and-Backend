import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  @ViewChild('audioChooser', {static: true}) public audioChooserElementRef: ElementRef;
  @ViewChild('imageChooser', {static: true}) public imageChooserElementRef: ElementRef;
  audio: File;
  image: File;

  uploadForm = new FormGroup({
    jwt: new FormControl(),
    title: new FormControl(),
    artist: new FormControl(),
    genre: new FormControl(),
  });

  constructor(private router: Router, private loadingCtrl: LoadingController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.listenerAudioChange();
    this.listnerImageChange();
  }

  async uploadContent() {

    const loading = await this.loadingCtrl.create();

    loading.present();
    try {
        console.log(this.uploadForm.get('jwt').value);
        //console.log(this.uploadForm.get('audio'));
        console.log(this.uploadForm.get('title').value);
        console.log(this.uploadForm.get('artist').value);
        console.log(this.uploadForm.get('genre').value);
        //console.log(this.uploadForm.get('image').value);

        console.log(this.audio);
        console.log(this.image);

        const fd = new FormData();

        if (this.image === undefined) {


          await fetch('assets/temp.jpg', {}).then((res) => {
            res.blob().then(blob => {

              const tempFile = new File([blob], 'temp.jpg', {type: 'image/jpg', lastModified: Date.now()});
              console.log(tempFile);

              fd.append('image', tempFile);
            });
          });
        } else {
          fd.append('image', this.image[0]);
        }

        const tempJWT = this.uploadForm.get('jwt').value;

        fd.append('audio', this.audio[0]);


        const tempTitle = this.uploadForm.get('title').value;
        fd.append('title', tempTitle);

        const tempArtist = this.uploadForm.get('artist').value;
        fd.append('artist', tempArtist);

        const tempGenre = this.uploadForm.get('genre').value;
        fd.append('genre', tempGenre);

        const uploadUrl = `http://10.0.2.2:8080/song/add`;

        await fetch(uploadUrl, {
          method: 'POST',
          body: fd,
          headers: new Headers({
            'Authorization': `Bearer ${tempJWT}`
          }),
        }).then(async res => {
          loading.dismiss();
          if (res.status === 200) {
            const toast = await this.toastCtrl.create({
              message: `Status: ${res.status} 'Successful Upload'`,
              duration: 2000
            });
            toast.present();
            this.router.navigate(['/home']);
          } else {
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
      } catch (err) {
        loading.dismiss();
        console.log('Error', err);
      }
  }

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

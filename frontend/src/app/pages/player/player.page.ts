/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';

// Services
import { AudioService } from 'src/app/services/audio/audio.service';
import { SongDataService } from 'src/app/services/songData/song-data.service';

// State
import { AudioState } from 'src/app/interfaces/audio-state';

// Packages
import { Capacitor } from '@capacitor/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController, Platform } from '@ionic/angular';

import { BACKEND_ANDROID_SERVER, BACKEND_SERVER, TOKEN_KEY } from 'src/app/constants';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { AddSongPlaylistModalComponent } from 'src/app/components/add-song-playlist-modal/add-song-playlist-modal.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
})
export class PlayerPage implements OnInit {

  files: Array<any> = [];
  state: AudioState;
  currentFile: any = {};
  currentPlt: any[] = [];
  isOnline = false;
  isWav = false;
  wavToggle = false;
  oggToggle = false;
  bitRate = '320';
  format = 'mp3';
  currentSongInfo: any =  {image: 'assets/temp.jpg'};
  ratingCheck = false;
  rating = null;

  constructor(
    public audioService: AudioService,
    public songDataService: SongDataService,
    private httpClient: HttpClient,
    private plt: Platform,
    private http: HttpClient,
    private storage: Storage,
    private toastCtrl: ToastController,
    private modalController: ModalController
  ) {

    // Get Media Files
    songDataService.getFiles().subscribe(files => {
      this.files = files;
    });

    // listen to stream state
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });


    this.currentPlt = plt.platforms();

  }

  ngOnInit() {
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.stop();

    if (file.sourceType === 'online') {
      console.log('Hello This is Online');
      const src = file.source;
      let tempUrl2 = '';
      let imgUrl = '';
      let infoUrl = '';
      let ratingUrl = '';

      console.log(this.currentPlt);

      this.isOnline = true;

      if (this.currentPlt[0] === 'android') {

        tempUrl2 = `${BACKEND_ANDROID_SERVER}/song/stream?s=${file.onlineId}&f=${this.format}&b=${this.bitRate}`;
        imgUrl = `${BACKEND_ANDROID_SERVER}/song/image?id=${file.onlineId}`;
        infoUrl = `${BACKEND_ANDROID_SERVER}/song/get?id=${file.onlineId}`;
        ratingUrl = `${BACKEND_ANDROID_SERVER}/rating/get?songId=${file.onlineId}`;

      } else {

        tempUrl2 = `${BACKEND_SERVER}/song/stream?s=${file.onlineId}&b=${this.bitRate}&f=${this.format}`;
        imgUrl = `${BACKEND_SERVER}/song/image?id=${file.onlineId}`;
        infoUrl = `${BACKEND_SERVER}/song/get?id=${file.onlineId}`;
        ratingUrl = `${BACKEND_SERVER}/rating/get?songId=${file.onlineId}`;

      }

      let tempJWT = '';
      this.storage.get(TOKEN_KEY).then(data => {
        tempJWT = data.toString();

        if (tempJWT === 'jwt-token' || tempJWT === '') {

        } else {
          fetch(ratingUrl, {
            method: 'GET',
            headers: new Headers({
              // eslint-disable-next-line quote-props
              'Authorization': `Bearer ${tempJWT}`
            })
          })
          .then(res => {
            res.json().then(json => {

              const tempCheck = json;

              if (tempCheck !== undefined) {
                this.rating = json.score;
              }
              this.ratingCheck = true;
            });
          });
        }

      });



      fetch(imgUrl, {})
      .then((res) => {
        res.blob().then(blob => {
          const imgUrl2 = URL.createObjectURL(blob);
          this.currentSongInfo.image = imgUrl2;
        });
      });

      fetch(infoUrl, {})
      .then ((result) => {
        result.json().then(data => {
          this.currentSongInfo.title = data.title;
          this.currentSongInfo.artist = data.artist;
          this.currentSongInfo.genre = data.genre;
          this.isWav = data.isWav;
        });
      });

      fetch(tempUrl2, {})
      .then((res) => {
        res.blob().then(blob => {
          const tempUrl3 = URL.createObjectURL(blob);
          this.playStream(tempUrl3);
        });
      });

    } else {

      this.isOnline = false;
      this.isWav = false;
      this.ratingCheck = false;
      this.rating = null;

      this.currentSongInfo.image = 'assets/temp.jpg';
      this.currentSongInfo.title = this.currentFile.file.title;
      this.currentSongInfo.artist = this.currentFile.file.artist;
      this.currentSongInfo.genre = this.currentFile.file.genre;
      console.log(this.currentFile);
      const tempUrl = Capacitor.convertFileSrc(file.source);

      this.playStream(tempUrl);
    }
  }

  playStream(url) {
    this.audioService.playStream(url, this.state.shuffle, this.state.repeat).subscribe(events => {

      if (this.state.songEnd === true && this.isLastPlaying() === false) {
        this.next();
      }

    });
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {

    if (this.state.repeat) {
      return this.repeat();
    }
    if (this.state.shuffle) {
      return this.shuffle();
    }

    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {

    if (this.state.repeat) {
      return this.repeat();
    }
    if (this.state.shuffle) {
      return this.shuffle();
    }

    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }
  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeStart(){
    this.state.onSeekState = this.state.playing;
    if(this.state.onSeekState) {
      this.pause();
    }
  }

  onSliderChangeEnd(change) {

    console.log(change.target.value);

    if (this.state.onSeekState) {
      this.audioService.seekTo(change.target.value);
      this.play();
    } else {
      this.audioService.seekTo(change.target.value);
    }
  }

  toggleShuffle() {

    this.state.shuffle = (!this.state.shuffle);
    console.log(`Shuffle: ${this.state.shuffle}`);

  }

  // Used for shuffling
  shuffle() {
    const index = Math.floor(Math.random() * (this.files.length - 1));
    const file = this.files[index];
    this.openFile(file, index);
  }

  // Used for repeating
  toggleRepeat() {
    this.state.repeat = (!this.state.repeat);
    console.log(`Repeat: ${this.state.repeat}`);
  }

  repeat() {
    const index = this.currentFile.index;
    const file = this.files[index];
    this.openFile(file, index);
  }

  // Used to set playbackspeed
  setPlaybackSpeed(speed) {
    this.audioService.playbackSpeed(speed);
  }

  // Used to set format of online songs
  setFormat(format: any) {

    if (format === 'mp3') {
      this.wavToggle = false;
      this.oggToggle = false;
      this.format = 'mp3';

      const index = this.currentFile.index;
      const file = this.files[index];

      this.openFile(file, index);

    }
    if (format === 'ogg') {
      this.wavToggle = false;
      this.oggToggle = true;
      this.format = 'ogg';
      this.bitRate = '256';

      const index = this.currentFile.index;
      const file = this.files[index];

      this.openFile(file, index);
    }
    if (format === 'wav') {
      this.wavToggle = true;
      this.oggToggle = true;
      this.format = 'wav';

      const index = this.currentFile.index;
      const file = this.files[index];

      this.openFile(file, index);
    }

  }

  // Used to set bitrate of online songs
  setBitrate(bitrate: any) {

    if (bitrate === '256') {

      this.bitRate = '256';

      const index = this.currentFile.index;
      const file = this.files[index];

      this.openFile(file, index);

    }
    if (bitrate === '320') {

      this.bitRate = '320';

      const index = this.currentFile.index;
      const file = this.files[index];

      this.openFile(file, index);

    }

  }


  // Used for setting ratings of online songs
  setRating(rating: number) {
    this.rating = rating;

    let addRatingUrl = '';

    if (this.currentPlt[0] === 'android') {
      addRatingUrl = `${BACKEND_ANDROID_SERVER}/rating/add`;
    } else {
      addRatingUrl = `${BACKEND_SERVER}/rating/add`;
    }

    let tempJWT = '';
    this.storage.get(TOKEN_KEY).then(async data => {
      tempJWT = data.toString();

      if (tempJWT === 'jwt-token' || tempJWT === '') {
        const toast = await this.toastCtrl.create({
          message: 'Not logged In',
          duration: 2000
        });

        toast.present();

      } else {
        fetch(addRatingUrl, {
          method: 'POST',
          headers: new Headers({
            // eslint-disable-next-line quote-props
            'Authorization': `Bearer ${tempJWT}`,
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({songId: `${this.currentFile.file.onlineId}`, score: `${rating}`})
        })
        .then(async res => {
          if (res.status === 200) {
            const toast = await this.toastCtrl.create({
              message: 'Rating added',
              duration: 2000
            });
            toast.present();
          }
        });
      }

    });
  }

  // Opens add song to playlist modal
  async addSongToPlaylist() {

    if (this.currentFile.file === undefined) {

    } else {

      let tempSong = {};

      if (this.currentFile.file.id === undefined) {

        tempSong = {
          title: this.currentSongInfo.title,
          artist: this.currentSongInfo.artist,
          album: 'No Album',
          genre: this.currentSongInfo.genre,
          source: this.currentFile.file.source,
          sourceType: this.currentFile.file.sourceType,
          onlineId: this.currentFile.file.onlineId
        };
      } else {

        tempSong = {
          id: this.currentFile.file.id,
          title: this.currentSongInfo.title,
          artist: this.currentSongInfo.artist,
          album: 'No Album',
          genre: this.currentSongInfo.genre,
          source: this.currentFile.file.source,
          sourceType: this.currentFile.file.sourceType,
          onlineId: this.currentFile.file.onlineId
        };
      }

      console.log(this.currentFile.file);

      const modal = await this.modalController.create({
        component: AddSongPlaylistModalComponent,
        componentProps: {
          inputSong: tempSong
        }
      });

      await modal.present();
    }

    }
}

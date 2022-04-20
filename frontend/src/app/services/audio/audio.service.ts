import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { AudioState } from 'src/app/interfaces/audio-state';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audioEvents = [
    'ended',
    'error',
    'play',
    'playing',
    'pause',
    'timeupdate',
    'canplay',
    'loadedmetadata',
    'loadstart'
  ];
  private stop$ = new Subject();
  private audioObj = new Audio();
  private state: AudioState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,

    // Extra Stuff
    onSeekState: false,
    songEnd: false,
    shuffle: false,
    repeat: false,
  };
  private stateChange: BehaviorSubject<AudioState> = new BehaviorSubject(
    this.state
  );

  constructor() { }

  playStream(url, shuffleState, repeatState) {
    return this.streamObservable(url, shuffleState, repeatState).pipe(takeUntil(this.stop$));

    // can either set this.audioObj.src = url or this.audioObj.srcObject = blob
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  playbackSpeed(speed) {

    this.audioObj.playbackRate = speed;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getState(): Observable<AudioState> {
    return this.stateChange.asObservable();
  }

  private streamObservable(url, shuffleState, repeatState) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState(shuffleState, repeatState);
      };
    });
  }

  private addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  private updateStateEvents(event: Event): void {

    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        this.state.songEnd = false;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case 'error':
        this.resetState(false, false);
        this.state.error = true;
        break;
      case 'ended':
        this.state.songEnd = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState(shuffleState, repeatState) {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,

      // Extra Stuff
      onSeekState: false,
      songEnd: false,
      shuffle: shuffleState,
      repeat: repeatState,
    };
  }
}

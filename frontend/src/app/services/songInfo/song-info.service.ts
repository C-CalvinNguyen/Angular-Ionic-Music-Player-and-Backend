import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongInfoService {

  song: any = {};

  constructor() { }

  setFiles(song) {
    this.song = song;
  }

  getFiles() {
    return of(this.song);
  }
}

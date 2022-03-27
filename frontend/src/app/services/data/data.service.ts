import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  files: any = [
    {title: 'Earth', artist: 'Asano', sourceType: 'online',
    source: 'http://10.0.2.2:8080/song/stream?s=623e51e4d5f9fcf0db4ff0ca&f=mp3&b=320', onlineId: '623e51e4d5f9fcf0db4ff0ca'}
  ];

  constructor() { }

  setFiles(files) {
    this.files = files;
  }

  getFiles() {
    return of(this.files);
  }
}

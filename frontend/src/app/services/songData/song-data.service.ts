import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongDataService {

  files: any = [];

  constructor() { }

  setFiles(files) {
    this.files = files;
  }

  getFiles() {
    return of(this.files);
  }
}

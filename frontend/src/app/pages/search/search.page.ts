import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SongDataService } from 'src/app/services/songData/song-data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchForm = new FormGroup({
    jwt: new FormControl(),
    searchText: new FormControl(),
    searchCondition: new FormControl()
  });

  searchContent: any[] = [
    {title: 'Test 1'},
    {title: 'Test 2'},
    {title: 'Test 3'},
  ];

  constructor(private toastCtrl: ToastController, private songDataService: SongDataService, private router: Router) { }

  ngOnInit() {
  }

  search() {
    const tempJWT = this.searchForm.get('jwt').value;
    let tempSearch = this.searchForm.get('searchText').value;
    let tempCondition = this.searchForm.get('searchCondition').value;

    console.log(tempSearch, tempCondition);


    // iF temp search and condition are null DEFAULT to teampSearch = '' and tempCondition = 'title'
    if (tempCondition === null) {
      tempCondition = 'title';
    }

    if (tempSearch === null) {
      tempSearch = '';
    }

    let url = '';

    switch (tempCondition) {
      case 'title':
        url = `http://localhost:8080/song/search/title?title=${tempSearch}`;
        this.callSearch(url, tempJWT);
        break;

      case 'genre':
        url = `http://localhost:8080/song/search/genre?genre=${tempSearch}`;
        this.callSearch(url, tempJWT);
        break;

      case 'artist':
        url = `http://localhost:8080/song/search/artist?artist=${tempSearch}`;
        this.callSearch(url, tempJWT);
        break;
    }

  }


  callSearch(url, jwt) {

    try {

      fetch(url, {
        method: 'GET',
        headers: new Headers ({
          'Authorization': `Bearer ${jwt}`
        })
      }).then(res => {
        res.json().then(async json => {
          if (json.songsFind.length === 0) {
            const toast = await this.toastCtrl.create({
              message: 'No Songs Found',
              duration: 2000
            });

            toast.present();
          } else {
            const toast = await this.toastCtrl.create({
              message: json.message,
              duration: 2000
            });

            this.searchContent = json.songsFind;
            console.log(this.searchContent);
            toast.present();
          }
        }).catch((err) => {
          console.log(err);
        });
      });

    } catch (err) {
      console.log(err);
    }

  }

  selectSong(index: any) {

    const tempSong = [{
      title: this.searchContent[index].title,
      artist: this.searchContent[index].artist,
      sourceType: this.searchContent[index].sourceType,
      // eslint-disable-next-line no-underscore-dangle
      source: `http://10.0.2.2:8080/song/stream?s=${this.searchContent[index]._id.toString()}&b=320&f=mp3`,
      // eslint-disable-next-line no-underscore-dangle
      onlineId: `${this.searchContent[index]._id.toString()}`
    }];

    console.log(tempSong);

    this.songDataService.setFiles(tempSong);
    this.router.navigate(['/player/']);
  }

}

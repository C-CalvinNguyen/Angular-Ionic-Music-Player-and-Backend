import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BACKEND_ANDROID_SERVER } from 'src/app/constants';
import { SongInfoService } from 'src/app/services/songInfo/song-info.service';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.page.html',
  styleUrls: ['./edit-song.page.scss'],
})
export class EditSongPage implements OnInit {

  song: any = {};
  avgRating: 0;

  constructor(private router: Router, private songInfoService: SongInfoService) {
    this.songInfoService.getFiles().subscribe(data => {
      this.song = data;
    });

    this.getAvgRating();
    this.getSongImage();
  }

  ngOnInit() {
    console.log(this.song);
  }

  getAvgRating() {

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const tempId = this.song['_id'].toString();

    fetch(`${BACKEND_ANDROID_SERVER}/rating/avg?songId=${tempId}`,
      {})
      .then(res => {
        res.json().then(json => {
          this.avgRating = json.avg;
          console.log(this.avgRating);
        });
      });

  }

  getSongImage() {

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const tempId = this.song['_id'].toString();

    fetch(`${BACKEND_ANDROID_SERVER}/song/image?id=${tempId}`, {})
    .then((res) => {
      res.blob().then(blob => {
        const imgUrl = URL.createObjectURL(blob);
        this.song.image = imgUrl;
      });
    })
    .catch(err => {
      console.error(err);
    });

  }

}

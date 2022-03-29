import { Component, OnInit, Input } from '@angular/core';
import { Song } from 'src/app/models/song.model';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database/database.service';

@Component({
  selector: 'app-add-song-playlist-modal',
  templateUrl: './add-song-playlist-modal.component.html',
  styleUrls: ['./add-song-playlist-modal.component.scss'],
})
export class AddSongPlaylistModalComponent implements OnInit {

  @Input() inputSong: Song;
  displayList = [];
  selectPlaylist = { id: '' };

  constructor(private modalController: ModalController, private db: DatabaseService) { }

  ngOnInit() {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getPlaylists().subscribe(data => this.displayList = data);
      }
    });
  }

  async addSongToPlaylist() {

    await this.db.addSongToPlaylist(this.inputSong.id, this.selectPlaylist.id).then(() => {
      console.log(`Song Added To Playlist`);
      this.modalController.dismiss();
    });
  }

}

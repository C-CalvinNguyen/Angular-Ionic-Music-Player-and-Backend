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

    if (this.inputSong.sourceType === 'offline') {
      await this.db.addSongToPlaylist(this.inputSong.id, this.selectPlaylist.id).then(() => {
        console.log(`Song Added To Playlist`);
        this.modalController.dismiss();
      });
    }
    else if(this.inputSong.sourceType === 'online') {

      // Find song in database by Online ID
      await this.db.getSongByOnlineId(this.inputSong.onlineId).then(async song => {
        console.log('Database songs ',song);

        // If no song is found, create song in db and add it to playlist
        if (song === null) {
          await this.db.addSong(this.inputSong.title, this.inputSong.artist,
            this.inputSong.album, this.inputSong.genre, this.inputSong.source, this.inputSong.sourceType,
            this.inputSong.onlineId).then(async () => {
              await this.db.getSongByOnlineId(this.inputSong.onlineId).then(async data => {
                await this.db.addSongToPlaylist(data.id, this.selectPlaylist.id).then(() => {
                  console.log(`Song Added To Playlist`);
                  this.modalController.dismiss();
                });
              });
            });
        } else {

          // if song was found add it to playlist
          await this.db.addSongToPlaylist(song.id, this.selectPlaylist.id).then(() => {
            console.log(`Song Added To Playlist`);
            this.modalController.dismiss();
          });
        }

      });
    }
  }

}

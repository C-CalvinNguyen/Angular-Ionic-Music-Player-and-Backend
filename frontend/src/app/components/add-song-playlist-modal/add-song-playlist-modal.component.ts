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

  // Variables of Modal
  // @Input song from List page or Player page
  @Input() inputSong: Song;

  // Used to display all playlists
  displayList = [];

  // ID of selected playlist
  selectPlaylist = { id: '' };

  constructor(private modalController: ModalController, private db: DatabaseService) { }

  // ngOnInit populates displayList with playlists from database
  ngOnInit() {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getPlaylists().subscribe(data => this.displayList = data);
      }
    });
  }

  /*
    method addSongToPlaylist() adds the song to the playlist
    if song is offline, add song to playlist
    if song is online check if it is added to local database and then add to playlist
  */
  async addSongToPlaylist() {

    // If song is offline add to playlist
    if (this.inputSong.sourceType === 'offline') {
      await this.db.addSongToPlaylist(this.inputSong.id, this.selectPlaylist.id).then(() => {
        this.modalController.dismiss();
      });
    }

    // If song is online check first if it exists in sqlite database
    else if(this.inputSong.sourceType === 'online') {

      // Find song in database by Online ID
      await this.db.getSongByOnlineId(this.inputSong.onlineId).then(async song => {

        // If no song is found, create song in db and add it to playlist
        if (song === null) {
          await this.db.addSong(this.inputSong.title, this.inputSong.artist,
            this.inputSong.album, this.inputSong.genre, this.inputSong.source, this.inputSong.sourceType,
            this.inputSong.onlineId).then(async () => {
              await this.db.getSongByOnlineId(this.inputSong.onlineId).then(async data => {
                await this.db.addSongToPlaylist(data.id, this.selectPlaylist.id).then(() => {
                  this.modalController.dismiss();
                });
              });
            });
        } else {

          // if song was found add it to playlist
          await this.db.addSongToPlaylist(song.id, this.selectPlaylist.id).then(() => {
            this.modalController.dismiss();
          });
        }

      });
    }
  }

}

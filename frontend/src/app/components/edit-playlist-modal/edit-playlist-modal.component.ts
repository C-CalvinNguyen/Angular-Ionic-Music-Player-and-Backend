import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database/database.service';

@Component({
  selector: 'app-edit-playlist-modal',
  templateUrl: './edit-playlist-modal.component.html',
  styleUrls: ['./edit-playlist-modal.component.scss'],
})
export class EditPlaylistModalComponent implements OnInit {

  // Variables
  // @Inputs from playlist list page
  @Input() playlistId;
  @Input() playlistTitle;

  // binded for new playlist
  newPlaylist = {title: ''};

  constructor(private modalController: ModalController, private db: DatabaseService) { }

  // Checks if database is ready
  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log('Database ready');
      }
    });
  }

  // method editPlaylist(), calls database and sets title to newPlaylist variable
  async editPlaylist() {
    const tempTitle = this.newPlaylist.title;
    const tempId = this.playlistId;

    console.log(tempTitle, tempId);

    await this.db.editPlaylist(tempTitle, tempId).then(() => {
      this.modalController.dismiss();
    });

  }

}

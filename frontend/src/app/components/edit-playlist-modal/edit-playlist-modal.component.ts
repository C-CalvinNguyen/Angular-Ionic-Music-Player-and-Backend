import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-edit-playlist-modal',
  templateUrl: './edit-playlist-modal.component.html',
  styleUrls: ['./edit-playlist-modal.component.scss'],
})
export class EditPlaylistModalComponent implements OnInit {

  @Input() playlistId;
  @Input() playlistTitle;

  newPlaylist = {title: ''};

  constructor(private modalController: ModalController, private db: DatabaseService) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log('Database ready');
      }
    });
  }

  async editPlaylist() {
    const tempTitle = this.newPlaylist.title;
    const tempId = this.playlistId;

    console.log(tempTitle, tempId);

    await this.db.editPlaylist(tempTitle, tempId).then(() => {
      console.log(tempTitle + ' Playlist Edited');
      this.modalController.dismiss();
    });

  }

}

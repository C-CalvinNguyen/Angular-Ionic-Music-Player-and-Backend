import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from '../../services/database/database.service';

@Component({
  selector: 'app-create-playlist-modal',
  templateUrl: './create-playlist-modal.component.html',
  styleUrls: ['./create-playlist-modal.component.scss'],
})
export class CreatePlaylistModalComponent implements OnInit {

  // Variables
  // binded to form
  newPlaylist = { title: ''};

  constructor(private modalController: ModalController, private db: DatabaseService) { }

  // Check if database is ready
  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log('Database ready');
      }
    });
  }

  // createNewPlaylist, get playlist title from newPlaylist variable
  async createNewPlaylist() {
    const tempTitle = this.newPlaylist.title;

    await this.db.addPlaylist(tempTitle).then(() => {
      this.modalController.dismiss();
    });
  }

}

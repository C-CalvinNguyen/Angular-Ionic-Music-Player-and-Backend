import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-create-playlist-modal',
  templateUrl: './create-playlist-modal.component.html',
  styleUrls: ['./create-playlist-modal.component.scss'],
})
export class CreatePlaylistModalComponent implements OnInit {

  newPlaylist = { title: ''};

  constructor(private modalController: ModalController, private db: DatabaseService) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log('Database ready');
      }
    });
  }

  async createNewPlaylist() {
    const tempTitle = this.newPlaylist.title;

    await this.db.addPlaylist(tempTitle).then(() => {
      console.log(tempTitle + ' Playlist Added');
      this.modalController.dismiss();
    });
  }

}

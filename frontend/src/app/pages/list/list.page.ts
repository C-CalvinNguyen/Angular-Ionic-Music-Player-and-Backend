import { Component, OnInit } from '@angular/core';

// Imported Packages
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../../services/database/database.service';
import { Song } from 'src/app/models/song.model';
import { ModalController } from '@ionic/angular';

// Components
import { CreatePlaylistModalComponent } from 'src/app/components/create-playlist-modal/create-playlist-modal.component';
import { EditPlaylistModalComponent } from 'src/app/components/edit-playlist-modal/edit-playlist-modal.component';
import { AddSongPlaylistModalComponent } from 'src/app/components/add-song-playlist-modal/add-song-playlist-modal.component';

// Services
import { SongDataService } from 'src/app/services/songData/song-data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  displayList = [];
  displaySong: Song[] = [];
  type = '';
  id = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DatabaseService,
    private modalController: ModalController,
    private songDatService: SongDataService
  ) { }

  ngOnInit() {

    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        // Get The Type of List Based on Params Type (Genre, Artist, All)
        this.type = this.route.snapshot.paramMap.get('type');

        // Get The ID (Artist => Specific Artist, Genre => Specific Genre, => All => songs)
        this.id = this.route.snapshot.paramMap.get('id') || '';

        this.loadContent();
      }
    });
  }

  // Gets Info To Display (Database Queries)
  async loadContent() {

    if (this.id === '') {

      if (this.type === 'genre') {
        await this.db.getGenres().then((data) => {
          console.log(data);
          this.displayList = data;
        });
      }

      if (this.type === 'artist') {
        await this.db.getArtists().then((data) => this.displayList = data);
      }

      if (this.type === 'playlist') {
        this.db.getPlaylists().subscribe(data => this.displayList = data);
      }
    } else {

      if (this.type === 'genre') {
        this.db.getSongsByGenre(this.id).subscribe(data => this.displaySong = data);
      }

      if (this.type === 'artist') {
        this.db.getSongsByArtist(this.id).subscribe(data => this.displaySong = data);
      }

      if (this.type === 'playlist') {
        // Get All Songs INSIDE Playlist
        this.db.getSongsByPlaylist(this.id).subscribe(data => this.displaySong = data);
      }

      if (this.type === 'all') {
        this.db.getAllSongs().subscribe(data => this.displaySong = data);
      }
    }
  }

  // TO DO: IF SELECT ARTIST/GENRE -> Change Path with Condition (DONE)
  // IF SELECT OF SONG -> PASS PLAYLIST ARRAY TO PLAYER && SONG SERVICE???
  async itemClicked(entry: any) {

    if (this.id === '') {

      const pathToOpen = this.type + '/' + entry;
      this.router.navigateByUrl(`/list/${pathToOpen}`);
    } else {
      // PASS PLAYLIST DATA && SELECTED SONG TO SONG SERVICE???
      console.log({index: entry, songs: this.displaySong});
      this.songDatService.setFiles(this.displaySong);
      this.router.navigate(['/player/']);
    }
  }

  async createPlaylist() {
    const modal = await this.modalController.create({
      component: CreatePlaylistModalComponent
    });

    await modal.present();
    modal.onDidDismiss().then(() => {
      this.loadContent();
    });
  }

  async deletePlaylist(id) {
    await this.db.deletePlaylist(id).then(() => {
      console.log('"Playlist Deleted"');
    });
    this.loadContent();
  }

  async editPlaylist(id, ttl) {
    const modal = await this.modalController.create({
      component: EditPlaylistModalComponent,
      componentProps: {
        playlistId: id,
        playlistTitle: ttl
      }
  });

    await modal.present();
    modal.onDidDismiss().then(() => {
      this.loadContent();
    });
  }

  async addSongToPlaylist(song) {
    const modal = await this.modalController.create({
      component: AddSongPlaylistModalComponent,
      componentProps: {
        inputSong: song
      }
    });

    await modal.present();
    modal.onDidDismiss().then(() => {
      this.loadContent();
    });
  }

  async deleteSongFromPlaylist(song, id) {
    await this.db.deleteSongFromPlaylist(song.id, id).then(() => {
      console.log('"Song Deleted From Playlist"');
      this.loadContent();
    });
  }
}

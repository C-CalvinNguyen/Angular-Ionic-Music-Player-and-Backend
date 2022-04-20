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

  // Variables used
  // displayList contains list of playlists
  displayList = [];
  // displaySong containts list of songs
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
  // Depending on criteria (genre, artist, playlist, all)
  async loadContent() {

    if (this.id === '') {

      if (this.type === 'genre') {
        await this.db.getGenres().then((data) => {

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

  // If itemClicked() is a song, pass the current lsit of songs to player, if its a genre/artist/playlist open that criteria
  async itemClicked(entry: any) {

    if (this.id === '') {

      const pathToOpen = this.type + '/' + entry;
      this.router.navigateByUrl(`/list/${pathToOpen}`);
    } else {

      // PASS PLAYLIST DATA && SELECTED SONG TO SONG SERVICE

      this.songDatService.setFiles(this.displaySong);
      this.router.navigate(['/player/']);
    }
  }

  // Opens create playlist modal
  async createPlaylist() {
    const modal = await this.modalController.create({
      component: CreatePlaylistModalComponent
    });

    await modal.present();
    modal.onDidDismiss().then(() => {
      this.loadContent();
    });
  }

  // delete playlist method (calls databaseService)
  async deletePlaylist(id) {
    await this.db.deletePlaylist(id).then(() => {
      console.log('"Playlist Deleted"');
    });
    this.loadContent();
  }

  // Opens edit playlist modal
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

  // Opens add playlist modal
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

  // Delete song from playlist method (calls databaseService)
  async deleteSongFromPlaylist(song, id) {
    await this.db.deleteSongFromPlaylist(song.id, id).then(() => {
      console.log('"Song Deleted From Playlist"');
      this.loadContent();
    });
  }
}

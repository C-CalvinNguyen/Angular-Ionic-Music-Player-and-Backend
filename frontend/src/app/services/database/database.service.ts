import { Injectable } from '@angular/core';

// Imported Packages
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../../models/song.model';
import { List } from '../../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  // Variables
  songs = new BehaviorSubject([]);
  playlist = new BehaviorSubject([]);

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {

    // Once platform is ready
    this.plt.ready().then(() => {

      // Create database
      this.sqlite.create({
        name: 'songs.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {

        // Set this.database variable to the created database (db)
        this.database = db;

        // Database Executions
        // Using SQLitePorter
        this.seedDatabase();
      });
    });
  }

  // Get SQLite Commands From seed.sql using SQLitePorter
  seedDatabase() {
    // Get seed.sql from assets/seed.sql
    this.http.get('assets/seed.sql', { responseType: 'text'})
    .subscribe(sql => {

      // Imports SQL into Database
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {

          // We Set Database as Ready
          this.dbReady.next(true);
        })
        .catch(err => console.error(err));
    });
  }

  // Returns BehaviorSubjet as Observable For
  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getAllSongs(): Observable<Song[]> {

    this.database.executeSql('SELECT * FROM song', []).then(data => {
      const tempSong: Song[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tempSong.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            artist: data.rows.item(i).artist,
            album: data.rows.item(i).album,
            genre: data.rows.item(i).genre,
            source: data.rows.item(i).source,
            sourceType: data.rows.item(i).sourceType,
            onlineId: data.rows.item(i).onlineId
          });
        }
      }

      this.songs.next(tempSong);

    });

    return this.songs.asObservable();
  }

  addSong(title: string, artist: string, album: string, genre: string, source: string, sourceType: string, onlineId: string) {
    const data = [title, artist, album, genre, source, sourceType, onlineId];
    return this.database
      .executeSql(
        'INSERT INTO song (title, artist, album, genre, source, sourceType, onlineId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        data
      );
  }

  getGenres() {
    return this.database.executeSql('SELECT DISTINCT genre FROM song', []).then(data => {
      const toReturn = [];

      if(data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          toReturn.push(data.rows.item(i).genre);
        }
      }
      return toReturn;
    });
  }

  getArtists() {
    return this.database.executeSql('SELECT DISTINCT artist FROM song', []).then(data => {
      const toReturn = [];

      if(data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          toReturn.push(data.rows.item(i).artist);
        }
      }
      return toReturn;
    });
  }

  deleteAllData() {
    return this.database.executeSql(
      'DELETE FROM song; DELETE FROM list; DELETE FROM song_list;', []
    );
  }

  getSongsByGenre(search: string): Observable<Song[]> {

    this.database.executeSql(`SELECT * FROM song WHERE genre LIKE '${search}'`, []).then(data => {
      const tempSong: Song[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tempSong.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            artist: data.rows.item(i).artist,
            album: data.rows.item(i).album,
            genre: data.rows.item(i).genre,
            source: data.rows.item(i).source,
            sourceType: data.rows.item(i).sourceType,
            onlineId: data.rows.item(i).onlineId
          });
        }
      }

      this.songs.next(tempSong);

    });

    return this.songs.asObservable();

  }

  getSongsByArtist(search: string): Observable<Song[]> {

    this.database.executeSql(`SELECT * FROM song WHERE artist LIKE '${search}'`, []).then(data => {
      const tempSong: Song[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tempSong.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            artist: data.rows.item(i).artist,
            album: data.rows.item(i).album,
            genre: data.rows.item(i).genre,
            source: data.rows.item(i).source,
            sourceType: data.rows.item(i).sourceType,
            onlineId: data.rows.item(i).onlineId
          });
        }
      }

      this.songs.next(tempSong);

    });

    console.log(this.songs);
    return this.songs.asObservable();
  }

  getSongByOnlineId(onlineId: string) {

    const toReturn = this.database.executeSql('SELECT * FROM song where song.onlineId = (?)', [onlineId]).then(data => {
      let tempSong: any = null;

      if (data.rows.length > 0) {
        tempSong = {
          id: data.rows.item(0).id,
          title: data.rows.item(0).title,
          artist: data.rows.item(0).artist,
          album: data.rows.item(0).album,
          genre: data.rows.item(0).genre,
          source: data.rows.item(0).source,
          sourceType: data.rows.item(0).sourceType,
          onlineId: data.rows.item(0).onlineId
        };
      }

      return tempSong;

    });

    return toReturn;
  }

  getPlaylists() {

    this.database.executeSql('SELECT * FROM list', []).then(data => {
      const tempPlaylist: List[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tempPlaylist.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title
          });
        }
      }


      this.playlist.next(tempPlaylist);

    });

    return this.playlist.asObservable();

  }

  addPlaylist(title: string) {
    return this.database.executeSql('INSERT INTO list (title) VALUES (?)', [title]);
  }

  editPlaylist(title: string, id: any) {
    console.log(title, id);
    return this.database.executeSql(`UPDATE list SET title = ? WHERE id = ${id}`, [title]);
  }

  deletePlaylist(id: any) {
    this.database.executeSql('DELETE FROM song_list WHERE l_id = ?', [id]).then(() => {
      console.log('Playlist Deleted From Join Table Song_List');
    });
    return this.database.executeSql('DELETE FROM list WHERE id = ?', [id]);
  }

  getSongsByPlaylist(id: string) {

    this.database.executeSql(
      `SELECT * FROM song LEFT JOIN song_list ON song.id = song_list.s_id WHERE song_list.l_id = ${id}`,
      []).then(data => {
      const tempSong: Song[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tempSong.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            artist: data.rows.item(i).artist,
            album: data.rows.item(i).album,
            genre: data.rows.item(i).genre,
            source: data.rows.item(i).source,
            sourceType: data.rows.item(i).sourceType,
            onlineId: data.rows.item(i).onlineId
          });
        }
      }

      this.songs.next(tempSong);

    });

    return this.songs.asObservable();

  }

  getOnlineSongsByPlaylist(id: string) {

    const tempSong2 = this.database.executeSql(
      `SELECT * FROM song LEFT JOIN song_list ON song.id = song_list.s_id WHERE song_list.l_id = ${id} AND song.sourceType = "online"`,
    []).then(data => {

      const tempSong: Song[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tempSong.push({
            id: data.rows.item(i).id,
            title: data.rows.item(i).title,
            artist: data.rows.item(i).artist,
            album: data.rows.item(i).album,
            genre: data.rows.item(i).genre,
            source: data.rows.item(i).source,
            sourceType: data.rows.item(i).sourceType,
            onlineId: data.rows.item(i).onlineId
          });
        }
      }

      return tempSong;
    });

    return tempSong2;

  }

  addSongToPlaylist(songId: any, listId: any){

    console.log(songId, listId);

    return this.database.executeSql('INSERT INTO song_list (s_id, l_id) VALUES (?, ?)', [songId, listId]);

  }

  deleteSongFromPlaylist(songId: any, listId: any){

    return this.database.executeSql(`DELETE FROM song_list WHERE s_id = ${songId} AND l_id = ${listId}`, []);

  }

}

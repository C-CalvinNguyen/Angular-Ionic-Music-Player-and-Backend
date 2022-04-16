import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSongPlaylistModalComponent } from 'src/app/components/add-song-playlist-modal/add-song-playlist-modal.component';
import { CreatePlaylistModalComponent } from 'src/app/components/create-playlist-modal/create-playlist-modal.component';
import { EditPlaylistModalComponent } from 'src/app/components/edit-playlist-modal/edit-playlist-modal.component';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharePlaylistModalComponent } from 'src/app/components/share-playlist-modal/share-playlist-modal.component';


@NgModule({
  declarations: [AddSongPlaylistModalComponent, CreatePlaylistModalComponent, EditPlaylistModalComponent, SharePlaylistModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    AddSongPlaylistModalComponent,
    CreatePlaylistModalComponent,
    EditPlaylistModalComponent,
    SharePlaylistModalComponent
  ]
})
export class SharedcomponentModule { }

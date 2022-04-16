import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSongPlaylistModalComponent } from 'src/app/components/add-song-playlist-modal/add-song-playlist-modal.component';
import { CreatePlaylistModalComponent } from 'src/app/components/create-playlist-modal/create-playlist-modal.component';
import { EditPlaylistModalComponent } from 'src/app/components/edit-playlist-modal/edit-playlist-modal.component';

import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddSongPlaylistModalComponent, CreatePlaylistModalComponent, EditPlaylistModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [
    AddSongPlaylistModalComponent,
    CreatePlaylistModalComponent,
    EditPlaylistModalComponent
  ]
})
export class SharedcomponentModule { }

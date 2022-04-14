import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditSongPageRoutingModule } from './edit-song-routing.module';

import { EditSongPage } from './edit-song.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditSongPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditSongPage]
})
export class EditSongPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetPlaylistPageRoutingModule } from './get-playlist-routing.module';

import { GetPlaylistPage } from './get-playlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GetPlaylistPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [GetPlaylistPage]
})
export class GetPlaylistPageModule {}

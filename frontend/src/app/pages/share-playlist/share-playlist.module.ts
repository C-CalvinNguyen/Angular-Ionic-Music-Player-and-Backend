import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SharePlaylistPageRoutingModule } from './share-playlist-routing.module';

import { SharePlaylistPage } from './share-playlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharePlaylistPageRoutingModule
  ],
  declarations: [SharePlaylistPage]
})
export class SharePlaylistPageModule {}

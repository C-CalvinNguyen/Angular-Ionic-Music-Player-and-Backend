import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharePlaylistPage } from './share-playlist.page';

const routes: Routes = [
  {
    path: '',
    component: SharePlaylistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharePlaylistPageRoutingModule {}

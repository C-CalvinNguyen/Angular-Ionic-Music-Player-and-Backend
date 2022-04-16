import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetPlaylistPage } from './get-playlist.page';

const routes: Routes = [
  {
    path: '',
    component: GetPlaylistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetPlaylistPageRoutingModule {}

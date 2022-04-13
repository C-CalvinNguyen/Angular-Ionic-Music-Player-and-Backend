import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditSongPage } from './edit-song.page';

const routes: Routes = [
  {
    path: '',
    component: EditSongPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditSongPageRoutingModule {}

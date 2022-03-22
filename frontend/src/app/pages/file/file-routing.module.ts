import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FilePage } from './file.page';

const routes: Routes = [
  {
    path: '',
    component: FilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilePageRoutingModule {}

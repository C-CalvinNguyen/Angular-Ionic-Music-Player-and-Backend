import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainappPage } from './mainapp.page';

const routes: Routes = [
  {
    path: '',
    component: MainappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainappPageRoutingModule {}

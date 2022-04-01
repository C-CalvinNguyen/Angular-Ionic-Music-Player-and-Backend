import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainappPageRoutingModule } from './mainapp-routing.module';

import { MainappPage } from './mainapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainappPageRoutingModule
  ],
  declarations: [MainappPage]
})
export class MainappPageModule {}

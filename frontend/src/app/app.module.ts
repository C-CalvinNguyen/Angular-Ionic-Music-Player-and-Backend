import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Imported Packages
import { File } from '@ionic-native/file/ngx';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Custom Module Import
import { SharedcomponentModule } from './modules/sharedcomponent/sharedcomponent.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    HttpClientModule, SharedcomponentModule, FormsModule, ReactiveFormsModule, IonicStorageModule.forRoot()],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    SQLitePorter,
    SQLite
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

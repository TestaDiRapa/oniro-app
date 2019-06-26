import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { GmapsPage } from './gmaps.page';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';


const routes: Routes = [
  {
    path: '',
    component: GmapsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GmapsPage],
  providers: [Diagnostic]
})
export class GmapsPageModule {}

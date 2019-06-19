import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { GmapsPage } from './gmaps.page';


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
  providers: []
})
export class GmapsPageModule {}

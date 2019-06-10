import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomedocPage } from './homedoc.page';

const routes: Routes = [
  {
    path: '',
    component: HomedocPage
  },
  {
    path: 'homedoc',
    component: HomedocPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomedocPage]
})
export class HomedocPageModule {}

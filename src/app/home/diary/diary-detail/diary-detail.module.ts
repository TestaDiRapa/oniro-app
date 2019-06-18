import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DiaryDetailPage } from './diary-detail.page';
import { GoogleChartsModule } from 'angular-google-charts';

const routes: Routes = [
  {
    path: '',
    component: DiaryDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleChartsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DiaryDetailPage]
})
export class DiaryDetailPageModule {}

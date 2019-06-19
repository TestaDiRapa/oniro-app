import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DiaryDetailPage } from './diary-detail.page';
import { GoogleChartsModule } from 'angular-google-charts';

import 'hammerjs';
import { ApneaPopoverComponent } from './apnea-popover/apnea-popover.component';

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
  declarations: [DiaryDetailPage, ApneaPopoverComponent],
  entryComponents: [ApneaPopoverComponent]
})
export class DiaryDetailPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule, PopoverController } from '@ionic/angular';

import { PatientDetailPage } from './patient-detail.page';
import { GoogleChartsModule } from 'angular-google-charts';

import 'hammerjs';

const routes: Routes = [
  {
    path: '',
    component: PatientDetailPage
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
  declarations: [PatientDetailPage, PopoverController],
  entryComponents: [PopoverController]
})
export class PatientDetailPageModule {}

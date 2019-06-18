import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PatientDetailPage } from './patient-detail.page';
import { GoogleChartsModule } from 'angular-google-charts';

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
  declarations: [PatientDetailPage]
})
export class PatientDetailPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SendModalPage } from './send-modal.page';
import 'hammerjs';
import { InfoPopoverPageModule } from './info-popover/info-popover.module';

const routes: Routes = [
  {
    path: '',
    component: SendModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPopoverPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SendModalPage]
})
export class SendModalPageModule {}

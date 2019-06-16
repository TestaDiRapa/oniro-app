import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListaDiarioPazientiPage } from './lista-diario-pazienti.page';

const routes: Routes = [
  {
    path: '',
    component: ListaDiarioPazientiPage
  },
  {
    path: 'homedoc/lista-diario-pazienti',
    component: ListaDiarioPazientiPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListaDiarioPazientiPage]
})
export class ListaDiarioPazientiPageModule {}

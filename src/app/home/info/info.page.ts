import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ModalController } from '@ionic/angular';
import { InfoModalComponent } from './info-modal/info-modal.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(private menuCtrl: MenuController, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.menuCtrl.toggle();
  }

  openModal(informazioni: string) {
    this.modalCtrl.create({
      component: InfoModalComponent,
      componentProps: {info: informazioni}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

}

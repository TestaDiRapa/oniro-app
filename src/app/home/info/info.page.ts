/**
 * This page allows the user to view the information about the application:
 * "sviluppatori";
 * "come usare l'app"
 * "why oniro?"
 */
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

  /**
   * This method is called every time the user clicks on the relative item.
   * It allows to open a different modal with the related information about the pressed item.
   * It is possible to see the information about: Oniro App, Developers, How to use application.
   */
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

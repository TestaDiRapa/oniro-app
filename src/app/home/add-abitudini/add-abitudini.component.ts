import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Bevanda } from './bevanda.model';

@Component({
  selector: 'app-add-abitudini',
  templateUrl: './add-abitudini.component.html',
  styleUrls: ['./add-abitudini.component.scss'],
})
export class AddAbitudiniComponent implements OnInit {
  @Input() bevanda: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  // simply close the modal
  onCloseModal() {
    this.modalCtrl.dismiss(0, 'close');
  }

  onSubmitModal(total: number, tipo: string) {
    const bevanda = new Bevanda(tipo, total);
    this.modalCtrl.dismiss(bevanda, 'confirm');
  }

}

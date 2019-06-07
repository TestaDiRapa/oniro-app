import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
    this.modalCtrl.dismiss(null, 'close');
  }

  onSubmitModal(total: number) {
    this.modalCtrl.dismiss(total, 'confirm');
  }

}

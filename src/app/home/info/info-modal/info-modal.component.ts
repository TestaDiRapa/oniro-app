import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {

  @Input() info: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  // simply close the modal
  onCloseModal() {
    this.modalCtrl.dismiss(null, 'close');
  }

}

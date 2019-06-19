import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss'],
})
export class InfoModalComponent implements OnInit {

  @Input() info: string;
  public isUser: boolean;

  constructor(private modalCtrl: ModalController, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.type.subscribe(type => {
      this.isUser = type;
    });
  }

  // simply close the modal
  onCloseModal() {
    this.modalCtrl.dismiss(null, 'close');
  }

}

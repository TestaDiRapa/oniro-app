/**
 * This is the Info modal about the relative information of the application
 */
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

  /**
   * This method is called every time the modal is created.
   * It allows to set the type of the current user: patient or doctor.
   */
  ngOnInit() {
    this.authService.type.subscribe(type => {
      this.isUser = type;
    });
  }

  /**
   * This method closes the modal.
   */
  onCloseModal() {
    this.modalCtrl.dismiss(null, 'close');
  }

}

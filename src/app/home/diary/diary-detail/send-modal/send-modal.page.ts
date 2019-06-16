import { Component, OnInit } from '@angular/core';
import { ControllerService } from 'src/app/services/controllerService.service';
import { UserService } from 'src/app/services/userService.service';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import 'hammerjs';
import { InfoPopoverPage } from './info-popover/info-popover.page';

export interface Doctor {
  id: string;
  address: string;
  email: string;
  name: string;
  phone_number: string;
  profile_picture: string;
  surname: string;
}

@Component({
  selector: 'app-send-modal',
  templateUrl: './send-modal.page.html',
  styleUrls: ['./send-modal.page.scss'],
})
export class SendModalPage implements OnInit {
  public doctors;

  constructor(
    private alertCtrl: AlertController,
    private controller: ControllerService,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.controller.onCreateLoadingCtrl();
    this.userService.getMyDoctor().then(observable => {
      observable.subscribe(response => {
        this.controller.onDismissLoaderCtrl();
        if (response.status === 'ok') {
          this.doctors = response.message;
          if (this.doctors.length === 0) {
            this.alertCtrl.create({
              header: 'ERROR!',
              message: 'Registrati prima ad un dottore!',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => { this.modalCtrl.dismiss(); }
                }
              ]
            }).then(alertEl => { alertEl.present(); }); 
          }
        } else {
          this.alertCtrl.create({
            header: 'CANNOT GET YOUR DOCTORS!',
            message: response.message,
            buttons: [
              {
                text: 'Ok',
                handler: () => { this.modalCtrl.dismiss(); }
              }
            ]
          }).then(alertEl => { alertEl.present(); });
        }
      });
    });
  }

  onDoctorSelect(doctor: Doctor) {
    this.modalCtrl.dismiss(doctor);
  }

  onDoctorPress(doctor: Doctor) {
    this.popoverCtrl.create(
      {
        component: InfoPopoverPage,
        componentProps: {
          "name": doctor.name,
          "surname": doctor.surname,
          "address": doctor.address,
          "phone_number": doctor.phone_number,
          "profile_picture": doctor.profile_picture
        }
      }
    ).then(popover => {
      popover.present()
    });
  }

  onDoctorRelease() {
    this.popoverCtrl.dismiss()
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}

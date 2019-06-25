/**
 * This class represents the modal that is shown every time the patient wants to send a message
 * to a doctor.
 */
import { Component, OnInit } from '@angular/core';
import { ControllerService } from 'src/app/services/controllerService.service';
import { UserService } from 'src/app/services/userService.service';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import 'hammerjs';
import { InfoPopoverPage } from './info-popover/info-popover.page';

/**
 * The interface that describes the information about the doctor
 */
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

  /**
   * This method is called every time the page is created the first time. It allows to
   * retrieve all the doctors linked to the patient from the server, thanks to the UserService
   */
  ngOnInit() {
    this.controller.onCreateLoadingCtrl();
    this.userService.getMyDoctor().then(observable => {
      observable.subscribe(response => {
        this.controller.onDismissLoaderCtrl();
        if (response.status === 'ok') {
          this.doctors = response.message;
          if (this.doctors.length === 0) { // No one doctor is linked to the patient
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

  /**
   * This method is called every time a doctor is selected. It allows to close the modal.
   * @param doctor The selected doctor on the modal
   */
  onDoctorSelect(doctor: Doctor) {
    this.modalCtrl.dismiss(doctor);
  }

  /**
   * This method is called every time the patient keeps pressed the doctor item. It allows to
   * show the PopOver with all the information about the selected doctor.
   * @param doctor The doctor that was pressed.
   */
  onDoctorPress(doctor: Doctor) {
    this.popoverCtrl.create(
      {
        component: InfoPopoverPage,
        componentProps: {
          'name': doctor.name,
          'surname': doctor.surname,
          'address': doctor.address,
          'phone_number': doctor.phone_number,
          'profile_picture': doctor.profile_picture
        }
      }
    ).then(popover => {
      popover.present();
    });
  }

  /**
   * This method is called every time the patient releases the doctor item.
   * It allows to close the PopOver.
   */
  onDoctorRelease() {
    this.popoverCtrl.dismiss();
  }

  /**
   * This method is called when the patient close the modal.
   * It allows to close the modal.
   */
  onCancel() {
    this.modalCtrl.dismiss();
  }

}

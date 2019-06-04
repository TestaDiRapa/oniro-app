import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-device',
  templateUrl: './select-device.page.html',
  styleUrls: ['./select-device.page.scss'],
})
export class SelectDevicePage implements OnInit {
  isLoaded = false;
  devices = [];

  constructor(
    private alertCtrl: AlertController,
    private bluetooth: BluetoothSerial,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.isLoaded = false;
    this.bluetooth.list().then(
      results => {
        for (const result of results) {
          if (result.hasOwnProperty('name') && result.hasOwnProperty('address')) {
            this.devices.push({
              name: result.name,
              address: result.address
            });
          } else if (result.hasOwnProperty('name') && result.hasOwnProperty('uuid')) {
            this.devices.push({
              name: result.name,
              address: result.uuid
            });
          }
        }
        this.isLoaded = true;
      },
      error => {
        this.alertCtrl
          .create(
            {
              header: 'An error occurred!',
              message: 'Paired devices cannot be fetched. Please try again later!',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.modalCtrl.dismiss();
                  }
                }
              ]
            }
          )
          .then(alertEl => {
            alertEl.present();
          });
      }
    );
  }

  onItemSelected(name: string, address: string) {
    const data = {
      name,
      address
    };
    this.modalCtrl.dismiss(data);
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

}

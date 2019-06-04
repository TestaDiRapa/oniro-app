import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth/bluetooth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { SelectDevicePage } from './select-device/select-device.page';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {
  isConnected = 'NOT YET';
  message = 'NO DATA YET';
  i = 0;

  constructor(
    private alertCtrl: AlertController,
    private bluetooth: BluetoothSerial,
    private bluetoothService: BluetoothService,
    private modal: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.bluetoothService.isEnabled().then(
      success => {
        this.connectRoutine();
      },
      error => {
        this.bluetooth.enable().then(
          success => {
            this.connectRoutine();
          },
          error => {
            this.alertCtrl.create({
              header: 'Error',
              message: error,
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.router.navigate(['/home']);
                  }
                }
              ]
            }).then(alertEl => {
              alertEl.present();
            });
          }
        );
      }
    );
    /*
  this.bluetooth.connect('00:18:E4:40:00:06')
    .subscribe(
      success => {
        this.isConnected = "SUCCESSFULLY CONNECTED";
        this.bluetooth
          .subscribe('\n')
          .subscribe(
            success => {
              this.message = success;
              this.i++;
            },
            error => {
              this.message = error;
            }
          );
      },
      error => {
        this.isConnected = error;
      }
    );
    */
  }

  private connectRoutine() {
    this.bluetoothService.device
      .then(value => {
        if (!value) {
          return this.deviceSelection();
        } else {
          return value;
        }
      })
      .then(data => {
        this.alertCtrl.create({
          header: 'boh',
          message: data.name + ' ' + data.address,
        }).then(alertEl => {
          alertEl.present();
        });
      });
  }

  private deviceSelection() {
    return this.modal.create({ component: SelectDevicePage }).then(modal => {
      modal.present();
      return modal.onDidDismiss().then(modalData => {
        if (!modalData.data.hasOwnProperty('address')) {
          this.alertCtrl.create({
            header: 'Error',
            message: 'No device selected!',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['/home']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        } else {
          let name = 'Oniro device';
          if (modalData.data.hasOwnProperty('name')) {
            name = modalData.data.name;
          }
          this.bluetoothService.addDevice(name, modalData.data.address);
        }
        return this.bluetoothService.device;
      });
    });
  }

}

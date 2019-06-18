import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import { Component, OnInit } from '@angular/core';
import { BluetoothService } from 'src/app/services/bluetooth/bluetooth.service';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { SelectDevicePage } from './select-device/select-device.page';
import { DataStoringService } from 'src/app/services/bluetooth/data-storage/data-storing.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {
  private timer = interval(60 * 1000);
  private animationTimer = interval(2 * 1000);
  private timerSubscription: Subscription;
  private currIndex = 0;
  private totalFrames = 4;
  public imagePath = `/src/assets/image/panda-animation/${this.currIndex}.png`;

  constructor(
    private alertCtrl: AlertController,
    private bluetooth: BluetoothSerial,
    private bluetoothService: BluetoothService,
    private dataMngr: DataStoringService,
    private modal: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.animationTimer.subscribe(() => {
      this.currIndex = (this.currIndex+1)%this.totalFrames;
      this.imagePath = `/src/assets/image/panda-animation/${this.currIndex}.png`;
    })
    this.timerSubscription = this.timer.subscribe(() => {
      this.dataMngr.sendData();
    });
    this.dataMngr.init();
    this.bluetoothService.isEnabled().then(
      () => {
        this.connectRoutine();
      },
      () => {
        this.bluetooth.enable().then(
          () => {
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
        this.bluetooth.connect(data.address).subscribe(
          () => {
            this.bluetooth.subscribe('\n').subscribe(
              success => {
                if (success) {
                  const payload = JSON.parse(success);
                  this.dataMngr.addRawData(payload);
                }
              }
            );
          },
          () => {
            this.alertCtrl.create({
              header: 'Error',
              message: 'Cannot communicate with the device, try again later!',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.router.navigate(['/home']);
                  }
                }
              ]
            });
          }
        );
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

  onStop() {
    this.timerSubscription.unsubscribe();
    this.dataMngr.stopTime = new Date();
    this.dataMngr.sendData(true);
    this.router.navigate(['/home']);
  }

}

import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

import { Component, OnInit } from '@angular/core';

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
    private bluetooth: BluetoothSerial
  ) { }

  ngOnInit() {
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
  }

}

import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  constructor(private bluetooth: BluetoothSerial) { }

  isEnabled() {
    return this.bluetooth.isEnabled()
  }
}

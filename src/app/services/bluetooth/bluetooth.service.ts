import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothDevice } from './bluetooth-device.model';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  private bluetoothDevice: BluetoothDevice = null;

  constructor(
    private bluetooth: BluetoothSerial,
    private storage: Storage
  ) { }

  isEnabled() {
    return this.bluetooth.isEnabled();
  }

  get device() {
    if (!this.bluetoothDevice) {
      return this.storage.get('device').then(stringObject => {
        if (stringObject) {
          this.bluetoothDevice = JSON.parse(stringObject);
          return this.bluetoothDevice;
        } else {
          return null;
        }
      },
      error => {
        return null;
      });
    }
    return new Promise( (resolve, reject) => {
      resolve(this.bluetoothDevice);
    });
  }

  addDevice(name: string, address: string) {
    this.bluetoothDevice = new BluetoothDevice(name, address);
    this.storage.set('device', JSON.stringify(this.bluetoothDevice));
  }

}

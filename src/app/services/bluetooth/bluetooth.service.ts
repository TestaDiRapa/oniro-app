import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothDevice } from './bluetooth-device.model';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  private bluetoothDevice: BluetoothDevice;

  constructor(private bluetooth: BluetoothSerial) { }

  isEnabled() {
    return this.bluetooth.isEnabled();
  }

  get device() {
    return this.bluetoothDevice;
  }

  addDevice(name: string, address: string) {
    
  }

  
}

import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { BluetoothDevice } from './bluetooth-device.model';
import { Storage } from '@ionic/storage';


/**
 * This service manages the bluetooth connection between the application and the device
 */
@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  private bluetoothDevice: BluetoothDevice = null;

  constructor(
    private bluetooth: BluetoothSerial,
    private storage: Storage
  ) { }

  /**
   * Returns if the Bluetooth is enabled
   * @returns {boolean} true if the device enabled bluetooth, false otherwise
   */
  isEnabled() {
    return this.bluetooth.isEnabled();
  }

  /**
   * Check if the application is already paired with a device or if has a device stored in
   * memory and returns it.
   * 
   * @returns {Promise<BluetoothDevice>} a promise containing the device
   */
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
      () => {
        return null;
      });
    }
    return new Promise( (resolve) => {
      resolve(this.bluetoothDevice);
    });
  }

  /**
   * This method receive the name and the address of a Bluetooth device and stores it in memory
   *
   * @param name the device name
   * @param address the device address
   */
  addDevice(name: string, address: string) {
    this.bluetoothDevice = new BluetoothDevice(name, address);
    this.storage.set('device', JSON.stringify(this.bluetoothDevice));
  }

}

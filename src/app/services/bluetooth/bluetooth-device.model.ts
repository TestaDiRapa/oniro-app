/**
 * This class models a Bluetooth device, that is identified by a name and a MAC address
 * (or UUID for iOS devices)
 */
export class BluetoothDevice {

    constructor(
        public name: string,
        public address: string
    ) { }

}
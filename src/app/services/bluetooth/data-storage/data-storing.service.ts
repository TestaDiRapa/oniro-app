import { Injectable } from "@angular/core";
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { BluetoothData } from './bluetooth-data.model';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

export interface RawBluetoothData {
    SpO2: number;
    oxyEvent: number;
    diaEvent: number;
    hr: number;
    rawHr: number[];
}

@Injectable({
    providedIn: 'root'
})
export class DataStoringService {
    private storedData: BluetoothData;

    constructor(
        private network: Network,
        private storage: Storage
    ) { }

    addRawData(raw: RawBluetoothData) {
        if (!this.storedData) {
            this.storedData = new BluetoothData;
        }

        this.storedData.insertSpO2(raw.SpO2);

        if (raw.oxyEvent > 0) {
            this.storedData.insertOxyEvent(raw.oxyEvent, new Date());
        }

        if (raw.diaEvent > 0) {
            this.storedData.insertDiaEvent(raw.diaEvent, new Date());
        }

        this.storedData.insertHR(raw.hr);

        this.storedData.insertRawHR(raw.rawHr);
    }

    sendData() {
        if (this.network.type == this.network.Connection.NONE) {
            if (this.storedData) {
                this.storage.set('local_data', JSON.stringify(this.storedData));
            }
        }
    }


}
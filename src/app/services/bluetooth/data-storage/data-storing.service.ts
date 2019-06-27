import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { BluetoothData } from './bluetooth-data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService, Respons } from '../../authentication/authentication.service';
import { ApneaEvent } from './apnea-event.model';

/**
 * This interface represent a raw packet sent by the Bluetooth device
 */
export interface RawBluetoothData {
    spo2: number;
    spo2_rate: number;
    oxy_event: number;
    dia_event: number;
    hr: number;
    hr_rate: number;
    movements_count: number;
}

/**
 * This service manages the data received from the Bluetooth device, aggregating them in memory
 * and sending them to the server
 */
@Injectable({
    providedIn: 'root'
})
export class DataStoringService {
    private storedData: BluetoothData[] = [];
    private initInstant: string;
    stopTime: Date;

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient,
        private network: Network,
        private storage: Storage
    ) { }

    /**
     * When the service starts, it removes any previously stored data
     */
    init() {
        this.initInstant = new Date().toISOString();
        this.storage.remove('sleep_data');
        this.storedData = [];
    }

    /**
     * This method receives a raw data packet (sent by the Bluetooth device) and stores it 
     * in a list
     * @param raw 
     */
    addRawData(raw: RawBluetoothData) {
        let oxyEvent = null;
        let diaEvent = null;
        if (raw.oxy_event > 0) {
            oxyEvent = new ApneaEvent(raw.oxy_event, new Date().toISOString());
        }
        if (raw.dia_event > 0) {
            diaEvent = new ApneaEvent(raw.dia_event, new Date().toISOString());
        }
        this.storedData.push(new BluetoothData(
            this.initInstant,
            raw.spo2,
            raw.spo2_rate,
            oxyEvent,
            diaEvent,
            raw.hr,
            raw.hr_rate,
            raw.movements_count
        ));
    }

    /**
     * This method loads the data stored in memory and sends them to the server
     */
    recoverAndSend() {
        this.storage.get('sleep_data').then(data => {
            this.storedData = JSON.parse(data).data;
            this.initInstant = JSON.parse(data).id;
            this.sendToServer(true);
        });
    }

    /**
     * The method checks if the device is connected to the Internet. If it's not, then it will 
     * store the sleep data in memory, otherwise it sends them to the server
     * @param terminate an optional parameter, true only when has to send the last packet of
     * the recording
     */
    sendData(terminate = false) {
        if (this.network.type !== this.network.Connection.NONE) {
            this.sendToServer(terminate);
        } else {
            this.serialize();
        }
    }

    /**
     * This method sends all the packet in the list to the server. If the response is successful,
     * then the sent packet are removed from the list. In addition, if the terminate parameter is true,
     * the method asks the server to elaboorate the data.
     * @param terminate a boolean parameter
     */
    private sendToServer(terminate: boolean) {
        if (this.storedData.length > 0) {
            const len = this.storedData.length;
            const url = 'http://' + environment.serverIp + '/user/my_recordings';
            const payload = this.storedData.copyWithin(0, len);
            this.authService.token.then(token => {
                this.http.put<Respons>(
                    url,
                    JSON.stringify(payload),
                    {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        })
                    }).subscribe(response => {
                        if (response.status === 'ok') {
                            this.storedData = this.storedData.slice(len, this.storedData.length);
                            this.storage.remove('sleep_data');
                            if (terminate) {
                                this.http.post(
// tslint:disable-next-line: max-line-length
                                    `http://${environment.serverIp}/user/my_recordings/process`,
                                    JSON.stringify({
                                        id: this.initInstant,
                                        stop:this.stopTime.toISOString()
                                    }),
                                    {
                                        headers: new HttpHeaders({
                                            'Content-Type': 'application/json',
                                            Authorization: 'Bearer ' + token
                                        })
                                    }
                                ).subscribe();
                            }
                        } else if (response.status === 'error' && terminate) {
                            this.serialize();
                        }
                    });
            });
        }
    }

    /**
     * This method serializes the sleep packets list into the local storage of the device.
     */
    serialize() {
        this.storage.set('sleep_data', JSON.stringify({
            id: this.initInstant,
            data: this.storedData
        }));
    }
}

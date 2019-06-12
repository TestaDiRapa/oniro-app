import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { BluetoothData } from './bluetooth-data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService, Respons } from '../../authentication/authentication.service';
import { ApneaEvent } from './apnea-event.model';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

export interface RawBluetoothData {
    spo2: number;
    spo2_rate: number;
    oxy_event: number;
    dia_event: number;
    hr: number;
    hr_rate: number;
    movements_count: number;
}

@Injectable({
    providedIn: 'root'
})
export class DataStoringService {
    private storedData: BluetoothData[] = [];
    private initInstant: string;

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient,
        private network: Network,
        private storage: Storage
    ) { }

    init() {
        this.initInstant = new Date().toISOString();
        this.storage.remove('sleep_data');
        this.storedData = [];
    }

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

    recoverAndSend() {
        this.storage.get('sleep_data').then(data => {
            this.storedData = JSON.parse(data).data;
            this.initInstant = JSON.parse(data).id;
            this.sendToServer(true);
        });
    }

    sendData(terminate = false) {
        if (this.network.type !== this.network.Connection.NONE) {
            this.sendToServer(terminate);
        } else {
            this.serialize();
        }
    }

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
                                this.http.get(
                                    `http://${environment.serverIp}/user/my_recordings/process?id=${this.initInstant}`,
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

    serialize() {
        this.storage.set('sleep_data', JSON.stringify({
            id: this.initInstant,
            data: this.storedData
        }));
    }
}

import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { BluetoothData } from './bluetooth-data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService, Respons } from '../../authentication.service';
import { ApneaEvent } from './apnea-event.model';
import { AlertController } from '@ionic/angular';

export interface RawBluetoothData {
    spo2: number;
    oxy_event: number;
    dia_event: number;
    hr: number;
    raw_hr: number[];
}

@Injectable({
    providedIn: 'root'
})
export class DataStoringService {
    private storedData: BluetoothData[] = [];
    private initInstant: string;

    constructor(
        private alertCtrl: AlertController,
        private authService: AuthenticationService,
        private http: HttpClient,
        private network: Network,
        private storage: Storage
    ) { }

    init() {
        this.sendData();
        this.initInstant = new Date().toISOString();
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
            oxyEvent,
            diaEvent,
            raw.hr,
            raw.raw_hr
        ));
    }

    sendData() {
        if (this.network.type !== this.network.Connection.NONE) {
            if (this.storedData == null) {
                this.storage.get('local_data').then(
                    data => {
                        if (data) {
                            this.storedData = JSON.parse(data);
                        } else {
                            this.storedData = [];
                        }
                        this.sendToServer();
                    }
                );
            } else {
                this.sendToServer();
            }
        }
    }

    serialize() {
        this.storage.set('local_data', JSON.stringify(this.storedData));
    }

    private sendToServer() {
        const url = 'http://' + environment.serverIp + '/user/my_recordings';
        const payload = this.storedData.shift();
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
                    if (response.status === 'error') {
                        this.storedData.unshift(payload);
                        this.alertCtrl.create({
                            header: 'ERror',
                            message: response.message
                        }).then(alert => { alert.present(); });
                    }
                });
        });
    }

}

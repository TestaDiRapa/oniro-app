import { Injectable } from "@angular/core";
import { Network } from '@ionic-native/network/ngx';
import { Storage } from '@ionic/storage';
import { BluetoothData } from './bluetooth-data.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthenticationService, Respons } from '../../authentication.service';

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
    private storedData: BluetoothData = null;
    private initInstant: string;

    constructor(
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

        this.checkForData().then(
            () => {
                this.storedData.insertSpO2(raw.spo2);

                if (raw.oxy_event > 0) {
                    this.storedData.insertOxyEvent(raw.oxy_event, new Date().toISOString());
                }

                if (raw.dia_event > 0) {
                    this.storedData.insertDiaEvent(raw.dia_event, new Date().toISOString());
                }

                this.storedData.insertHR(raw.hr);

                this.storedData.insertRawHR(raw.raw_hr);
            }
        );
    }

    sendData() {
        if (this.network.type == this.network.Connection.NONE) {
            if (this.storedData) {
                this.storage.set('local_data', JSON.stringify(this.storedData));
            }
        }
        else {
            if (!this.storedData) {
                this.storage.get('local_data').then(
                    data => {
                        if (data) {
                            this.sendToServer(data);
                        }
                    }
                );
            } else {
                this.sendToServer(JSON.stringify(this.storedData));
            }
        }
    }

    private checkForData() {
        if (!this.storedData) {
            return this.storage.get('local_data').then(
                data => {
                    if (data) {
                        this.storedData = JSON.parse(data);
                    }
                    else {
                        this.storedData = new BluetoothData(this.initInstant);
                    }
                }
            )
        }
        return new Promise<any>((resolve, reject) => {
            resolve();
        });
    }

    private sendToServer(arg: string) {
        const url = "http://" + environment.serverIp + "/user/my_recordings";
        this.http.put<Respons>(
            url,
            arg,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.authService.getToken()
                })
            }).subscribe(response => {
                if (response.status == "ok") {
                    this.storage.remove('local_data').then(
                        () => {
                            this.storedData = null;
                        }
                    )
                }
            });
    }

}
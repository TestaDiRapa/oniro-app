import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService, Respons } from './authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DoctorService {

    constructor(
        private authService: AuthenticationService,
        private http: HttpClient,
    ) { }

    getRequests() {
        const path = 'http://' + environment.serverIp + '/doctor/my_patients';
        return this.authService.token.then(token => {
            return this.http.get<Respons>(
                path,
                {
                    headers: new HttpHeaders({
                        Authorization: 'Bearer ' + token
                    })
                });
        });
    }

    acceptPatient(cf: string) {
        const path = 'http://' + environment.serverIp + '/doctor/my_patients';
        const body = cf;
        return this.authService.token.then(token => {
            return this.http.post<Respons>(
                path,
                body,
                {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
                    })
                });
        });
    }

    rejectPatient(cf: string) {
        const path = 'http://' + environment.serverIp + '/doctor/my_patients';
        let params = new HttpParams();
        params = params.append('patient_cf', cf);
        return this.authService.token.then(token => {
            return this.http.delete<Respons>(
                path,
                {
                    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }),
                    params
                }
            );
        });
    }

    deleteMessagePatient(idDate: string, cf: string) {
        const path = 'http://' + environment.serverIp + '/doctor/my_alerts';
        let params = new HttpParams();
        params = params.append('id', idDate);
        params = params.append('cf', cf);
        return this.authService.token.then(token => {
            return this.http.delete<Respons>(
                path,
                {
                    headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }),
                    params
                }
            );
        });
    }

}

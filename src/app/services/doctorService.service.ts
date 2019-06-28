/**
 * This service contains methods to send requests to the server in order:
 * get patient requests associated with a doctor
 * accept a patient request using patient cf
 * reject a patient request using patient cf
 * get a patient message
 * delete a patient message
 */
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

    /**
     * Get the patient's requests that are linked to the doctor
     *
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */
    getPatientRequests() {
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
    /**
     * Accept the patient's subscription requests.
     * Only subscripted patients can send alert messages to the doctor.
     * A doctor can see the patient's diary only if he is subscripted to the doctor.
     *
     * @param cf the cf to send to server
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */
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

    /** 
     * Reject the patient's subscription requests
     *
     * @param cf the cf to send to server
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */

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

    /** 
     * Get the patient's alert messages
     *
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */
    getMessagePatient() {
        const path = 'http://' + environment.serverIp + '/doctor/my_alerts';
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

    /**
     * Delete the patient's alert message after checking it
     *
     * @param idDate the idDate is the id of message
     * @param cf the cf linked to the patient that sent the message
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */
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

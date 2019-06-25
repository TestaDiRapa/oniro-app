/**
 * This service contains methods to send requests to the server in order:
 * get doctors associated with a patient
 * upload patient's habits to the server
 * change information about the user's profile
 * upload information recorded during the night
 * send requests to a specific doctor
 */


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthenticationService, Respons } from './authentication/authentication.service';
import { Abitudini } from '../home/add-abitudini/abitudini.model';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs/internal/observable/from';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authService: AuthenticationService,
    private http: HttpClient,
  ) { }
/** Get the information about doctors that are linked to a patient.
 *
 * @returns {Promise} The message from the server with the information, or a message error.
 */
  getMyDoctor() {
    const path = 'http://' + environment.serverIp + '/user/my_doctors';
    return this.authService.token.then(token => {
      return this.http.get<Respons>(
        path,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token //this param is used to put the token
          })
        });
    });
  }
/** Put on the server the information about user's attribute.
 * 
 * @param abitudine the habit to send to the doctor.
 * @returns {Promise} a message from the server about the request, if it's correct or not.
 */
  putMyHabits(abitudine: Abitudini) {
    const path = 'http://' + environment.serverIp + '/user/habits';
    return this.authService.token.then(token => {
      return this.http.put<Respons>(
        path,
        JSON.stringify(abitudine),
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token //this param is used to put the token
          })
        });
    });
  }
/**Update the information about user's profile on the server.
 * 
 * @param formData the updated data ready to be sent to the server.
 * @returns {Promise} a message from the server with the information, or a message error.
 */
  changeProfile(formData: FormData) {
    const path = 'http://' + environment.serverIp + '/me';
    return from(this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        formData,
        {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`, //this param is used to put the token
            'Cache-Control': 'no-cache'
          })
        });
    }));
  }
/** Send a request to the specified doctor
 * 
 * @param idDoc the identifier of the doc to whom the patient wants to send the request.
 * @returns {Promise} a message from the server with the information, or a message error.
 */
  sendRequestToDoc(idDoc: string) {
    const path = 'http://' + environment.serverIp + '/user/my_doctors';
    const body =  JSON.stringify({doctor_id: idDoc});
    return this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        body,
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token //this param is used to put the token
          }),
        });
    });
  }
/** Send data to a specific doctor. 
 * 
 * @param doctorId the id of the doctor to whom the patient wants to send data.
 * @param dateID the record identifier of the data that the patient wants to send.
 * @returns {Promise} a message from the server with the information, or a message error.
 */
  sendRecordings(doctorId: string, dateID: string) {
    const path = 'http://' + environment.serverIp + '/user/my_recordings/send';
    const body = JSON.stringify({ id: dateID, doctor: doctorId });
    console.log(body);
    return this.authService.token.then(token => {
      return this.http.post<Respons>(
        path,
        body,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json',
           Authorization: 'Bearer ' + token //this param is used to put the token
           }),
        });
    });
  }

}

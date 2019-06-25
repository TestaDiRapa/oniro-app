import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService, Respons } from 'src/app/services/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GetCoordService {
  url = 'http://45.76.47.94:8080/user/getcoordinates';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
  ) { }

    /** Get the address of the doctor
     * @returns {Promise<Observable<Respons>>} The message from the server with the information, or a message error.
     */

  getCoordinates() {
    return this.authService.token.then(token => {
      return this.http.get<Respons>(
        this.url,
        {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token
          })
        });
    });
  }
}

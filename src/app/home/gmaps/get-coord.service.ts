import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService, Respons } from 'src/app/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GetCoordService {
  url = 'http://45.76.47.94:8080/user/getcoordinates';
  token: string;

  constructor(private http: HttpClient,
              private authService: AuthenticationService) { }

  getCoordinates() {
this.token = this.authService.getToken();
return this.http.get<Respons>(this.url, {headers: new HttpHeaders( {Authorization: 'Bearer ' + this.token })});
  }
}

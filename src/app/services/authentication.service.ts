import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ResponseGet {
    status: string;
    access_token: string;
    message: string;
}
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    login(username: string, password: string, isUser: boolean) {
        let params = new HttpParams();
        let path = 'http://45.76.47.94:8080/login/';

        if (isUser) {
            path += 'user';
        } else {
            path += 'doc';
        }
        params = params.append('cf', username);
        params = params.append('password', password);
        return this.http.get<ResponseGet>(path, { params });

    }

}

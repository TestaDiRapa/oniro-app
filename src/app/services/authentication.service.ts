import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(private http: HttpClient) { }

    login(username: string, password: string, isUser: boolean) {
        let data: Observable<any>;
        let params = new HttpParams();
        let path = 'http://45.76.47.94:8080/login/';

        if (isUser) {
            path += 'user';
        } else {
            path += 'doc';
        }
        console.log(path);
        params = params.append('cf', username);
        params = params.append('password', password);

        data = this.http.get(path, { params });
        data.subscribe(res => {
            console.log(res);
            if(res.status === 'ok'){
                console.log(res.access_token);
                return true;
            } else {
                console.log(res.message);
                return false;
            }

        });
    }

}

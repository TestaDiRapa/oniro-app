import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/userService.service';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';
import { HttpClient,  HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isUser = true;
  private username: string;
  private password: string;

  constructor(private router: Router, private auth: AuthenticationService, private user: UserService, private http: HttpClient) { }

  ngOnInit() {
  }

  // check if the ion-segment value is changed or not
  onChange(event: CustomEvent<SegmentChangeEventDetail>, form: NgForm) {
    if (event.detail.value === 'user') {
      this.isUser = true;
      form.reset();
    } else {
      this.isUser = false;
      form.reset();
    }
  }

  // the event called on form submission
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (this.isUser) {
      this.username = form.value.cf;
    } else {
      this.username = form.value.albo;
    }
    this.password = form.value.password;
    // booleano da impostare a this.isUser
    this.auth.login(this.username, this.password, this.isUser).subscribe(res => {
      if (res.status === 'ok') {
        const token = res.access_token;
        this.auth.setToken(token);
// tslint:disable-next-line: max-line-length
        this.http.get<any>('http://45.76.47.94:8080/me', {headers: new HttpHeaders( {Authorization: 'Bearer ' + token  })}).subscribe(resu => {
          if (this.isUser) {
// tslint:disable-next-line: no-string-literal
          this.user.setUser(new Paziente(resu.message['name'], resu.message['surname'], null,
// tslint:disable-next-line: no-string-literal
          resu.message['phone_server'], resu.message['email'], resu.message['_id'], resu.message['age']));
        } else {
// tslint:disable-next-line: no-string-literal
          this.user.setUser(new Medico(resu.message['name'], resu.message['surname'], null,
// tslint:disable-next-line: no-string-literal
           resu.message['phone'], resu.message['email'], resu.message['_id'], resu.message['address']));
        }
          this.auth.isAuthenticated = true;
          this.router.navigateByUrl('/home');
      });

      } else {
        console.log(res.message);
      }

    });

  }

}

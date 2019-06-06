import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/userService.service';
import { Paziente } from '../register/paziente.model';
import { Medico } from '../register/medico.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isUser = true;
  private username: string;
  private password: string;

  constructor(private router: Router, private auth: AuthenticationService, private user: UserService) { }

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
    this.auth.login(this.username, this.password, true).subscribe(res => {
      console.log(res);
      if (res.status === 'ok') {
        if (this.isUser) {
          this.user.setUser(new Paziente(res.message['name'], res.message['surname'], null ,
           res.message['phone_server'], res.message['email'], res.message['_id'], res.message['age']));
        } else {
          this.user.setUser(new Medico(res.message['name'], res.message['surname'], null,
           res.message['phone'], res.message['email'], res.message['_id'], res.message['address']));
        }
        console.log(this.user.getUser());
        this.auth.isAuthenticated = true;
        this.router.navigateByUrl('/home');


      } else {
        console.log(res.message);
      }

    });

  }

}

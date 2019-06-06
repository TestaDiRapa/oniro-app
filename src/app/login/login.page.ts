import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isUser = true;
  private username: string;
  private password: string;
  private goOn = false;

  constructor(private router: Router, private auth: AuthenticationService) { }

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
    //booleano da impostare a this.isUser
    this.auth.login(this.username, this.password, true).subscribe(res => {
      console.log(res);
      if (res.status === 'ok') {
        console.log(res.access_token);
        this.goOn = true;
      } else {
        console.log(res.message);
      }

    });

  }

  // the event on login event of the ion-button Login
  onLogin(form: NgForm) {
    if(this.goOn) {
      this.router.navigateByUrl('/home');
    }
  }

}

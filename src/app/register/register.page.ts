import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isUser = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    // to do
  }

  onRegister() {
    this.router.navigateByUrl('/home');
  }

  onChange(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'user') {
      this.isUser = true;
    } else {
      this.isUser = false;
    }
  }

}

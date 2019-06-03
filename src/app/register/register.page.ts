import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  result = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm){
    if (!form.valid) {
      return;
    }
    //to do
  }

  onRegister(form: NgForm){
    console.log(form);
    this.router.navigateByUrl('/home');
  }

}

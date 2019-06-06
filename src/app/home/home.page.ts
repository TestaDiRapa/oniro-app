import { Component, OnInit } from '@angular/core';
import { Paziente } from '../register/paziente.model';
import { UserService } from '../services/userService.service';
import { Medico } from '../register/medico.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
user: Paziente | Medico;

  constructor(
    public userService:UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
  }
}

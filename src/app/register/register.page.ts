import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Paziente } from './paziente.model';
import { Medico } from './medico.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public isUser = true;
  private paziente: Paziente;
  private medico: Medico;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    if (this.isUser) {
      this.paziente = new Paziente(form.value.nome, form.value.cognome, form.value.password, form.value.telefono, form.value.email, form.value.cf, form.value.eta.toString());
    } else {
      const address = form.value.via + ' ' + form.value.civico.toString() + ' ' + form.value.citta + ' ' + form.value.provincia;
      this.medico = new Medico(form.value.nome, form.value.cognome, form.value.password, form.value.telefono, form.value.email, form.value.idalbo, address);
    }

  }

  onRegister(form: NgForm) {
    const address = form.value.via + ' ' + form.value.civico.toString() + ' ' + form.value.citta + ' ' + form.value.provincia;
    form.reset();
    this.router.navigateByUrl('/home');
  }

  onChange(event: CustomEvent<SegmentChangeEventDetail>, form: NgForm) {
    if (event.detail.value === 'user') {
      this.isUser = true;
      form.reset();
    } else {
      this.isUser = false;
      form.reset();
    }
  }

}

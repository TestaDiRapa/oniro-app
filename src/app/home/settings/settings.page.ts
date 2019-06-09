import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService.service';
import { Paziente } from '../../register/paziente.model';
import { MenuController, AlertController } from '@ionic/angular';
import { Medico } from '../../register/medico.model';
import { AuthenticationService, Respons } from 'src/app/services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Respons {
  status: string;
  access_token: string;
  message: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {
  private path = 'http://45.76.47.94:8080/me';
  private header = new HttpHeaders({ Authorization: 'Bearer ' + this.authService.getToken() });
  public user: Paziente | Medico;
  public isUser = false;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.isUser = this.authService.getUserType();
    this.menuCtrl.toggle();
  }

  private onSubmit(key: string[], value: string[]) {
    const formData = new FormData();
    for (let i = 0; i < key.length; i++) {
      formData.append(key[i], value[i]);
    }
    return this.http.post<Respons>(this.path, formData, { headers: this.header })
      .subscribe(resData => {
        if (resData.status === 'ok') {
          if (key[0] === 'age') {
            this.user.setAge(value[0]);
          } else if (key[0] === 'phone_number') {
            this.user.setPhone(value[0]);
          } else if (key[0] === 'address') {
            this.user.setAddress(value[0]);
          }
        } else {
          this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
        }
      });
  }

  onAgeModify() {
    this.alertCtrl.create({
      header: 'Vuoi cambiare la tua età?',
      inputs: [
        {
          name: 'eta',
          type: 'number',
          placeholder: this.user.getAge(),
        }],
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: (inputs: { eta: number }) => {
            const eta = inputs.eta.toString().trim();
            if (eta.length > 0) {
              const key = ['age'];
              const value = [eta];
              this.onSubmit(key, value);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }]
    }).then(alert => alert.present());
  }

  onPhoneModify() {
    this.alertCtrl.create({
      header: 'Vuoi cambiare il tuo numero di cellulare?',
      inputs: [
        {
          name: 'telefono',
          type: 'tel',
          placeholder: this.user.getPhone(),
        }],
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: (inputs: { telefono: string }) => {
            const phone = inputs.telefono.trim();
            if (phone.length > 0) {
              const key = ['phone_number'];
              const value = [phone];
              this.onSubmit(key, value);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }]
    }).then(alert => alert.present());
  }

  onPswModify() {
    this.alertCtrl.create({
      header: 'Vuoi cambiare la password?',
      inputs: [
        {
          name: 'oldp',
          type: 'password',
          placeholder: 'Old password',
        },
        {
          name: 'newp',
          type: 'password',
          placeholder: 'New password',
        }],
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: (inputs: { oldp: string, newp: string }) => {
            const oldp = inputs.oldp.trim();
            const newp = inputs.newp.trim();
            if (newp.length > 0) {
              const key = ['old_password', 'new_password'];
              const value = [oldp, newp];
              this.onSubmit(key, value);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }]
    }).then(alert => alert.present());
  }

  onAddrModify() {
    this.alertCtrl.create({
      header: 'Vuoi cambiare indirizzo?',
      inputs: [
        {
          name: 'via',
          type: 'text',
          placeholder: 'Via: ',

        },
        {
          name: 'civico',
          type: 'number',
          placeholder: 'Civico:',
        },
        {
          name: 'citta',
          type: 'text',
          placeholder: 'Città: ',
        },
        {
          name: 'provincia',
          type: 'text',
          placeholder: 'Provincia: ',
        }],
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: (inputs: { via: string, civico: number, citta: string, provincia: string }) => {
            const road = inputs.via;
            const numb = inputs.civico.toString();
            const city = inputs.citta;
            const prov = inputs.provincia;
            if (road.length > 0 && numb.length > 0 && city.length > 0 && prov.length > 0) {
              const address = road + ' ' + numb + ' ' + city + ' ' + prov;
              const key = ['address'];
              const value = [address];
              this.onSubmit(key, value);
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }]
    }).then(alert => alert.present());
  }

}

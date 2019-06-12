import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService.service';
import { MenuController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  public isEmpty: boolean;
  public isLoaded = false;
  public urlImgage: string;
  public base64Image: string;
  public isUser = true;
  public name: string;
  public surname: string;
  public id: string;
  public phone: string;
  public age: string;
  public email: string;
  public address: string;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private camera: Camera
  ) { }

  ngOnInit() {
    this.authService.getUser().then(user => { console.log(user); });
    this.authService.getUser().then(user => {
      if (user.image) {
        this.isEmpty = false;
        this.base64Image = user.image;
      } else {
        this.isEmpty = true;
      }
      this.name = user.name;
      this.surname = user.surname;
      this.phone = user.phone_number;
      this.email = user.email;
      this.authService.getUserType().then(isUser => {
        this.isUser = isUser;
        if (isUser) {
          this.id = user['cf'];
          this.age = user['age'];
        } else {
          this.id = user['id'];
          this.address = user['address'];
        }
        this.isLoaded = true;
      });
    });

    this.menuCtrl.close();
  }

  private onSubmit(key: string[], value: string[], type: string) {
    const formData = new FormData();
    for (let i = 0; i < key.length; i++) {
      formData.append(key[i], value[i]);
    }
    this.userService.changeProfile(formData).subscribe(success => {
      success.subscribe(resData => {
        console.log('ResData PEr Age', resData);
        if (resData.status === 'ok') {
          this.authService.getUser().then(user => {
            if (type === 'addr' && user.hasOwnProperty('address')) {
              user['address'] = formData.get('address').toString();
              this.address = formData.get('address').toString();
            } else if (type === 'phone' ) {
              user.phone_number = formData.get('phone_number').toString();
              this.phone = formData.get('phone_number').toString();
            } else if (type === 'age' && user.hasOwnProperty('age')) {
              user['age'] = formData.get('age').toString();
              this.age = formData.get('age').toString();
            }
            this.authService.setUser(user);
            this.alertCtrl.create({ header: 'Cambiamento effettuato!' }).then(alert => alert.present());
          });
        } else {
          this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
        }
      });
    });
  }

  onAgeModify() {
    this.alertCtrl.create({
      header: 'Vuoi cambiare la tua età?',
      inputs: [
        {
          name: 'eta',
          type: 'number',
          placeholder: '__',
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
              this.onSubmit(key, value, 'age');
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
    this.authService.getUser().then(user => {
      this.alertCtrl.create({
        header: 'Vuoi cambiare il tuo numero di cellulare?',
        inputs: [
          {
            name: 'telefono',
            type: 'tel',
            placeholder: user.phone_number,
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
                this.onSubmit(key, value, 'phone');
              }
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { }
          }]
      }).then(alert => alert.present());
    });
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
              this.onSubmit(key, value, 'psw');
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
              this.onSubmit(key, value, 'addr');
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

  accessCamera() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 350,
      targetWidth: 350,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imgData) => {
      this.urlImgage = (<any>window).Ionic.WebView.convertFileSrc(imgData);
      this.base64Image = this.urlImgage;
    }, (err) => {
      console.log(err);
    });
  }

  accessGallery() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 350,
      targetWidth: 350,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then(imgData => {
      this.base64Image = 'data:image/jpeg;base64,' + imgData;
      let formData = new FormData();
      formData.append('image', this.base64Image);
      this.userService.changeProfile(formData).subscribe(success => {
        success.subscribe(resData => {
          if (resData.status === 'ok') {
            console.log("PRIMA: " + this.urlImgage);
            this.urlImgage = resData.message; // url dell'immagine
            console.log("DOPO: " + this.urlImgage);
            this.authService.getUser().then(user => {
              user.image = this.urlImgage;
              this.authService.setUser(user);
            });
          } else {
            this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
          }
        });
      });
    }, (err) => {
      console.log(err);
    });
  }
}

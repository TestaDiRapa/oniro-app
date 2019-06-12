import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService.service';
import { Paziente } from '../../register/paziente.model';
import { MenuController, AlertController } from '@ionic/angular';
import { Medico } from '../../register/medico.model';
import { AuthenticationService, Respons } from 'src/app/services/authentication/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  public isEmpty: boolean;
  public isLoaded = false;
  public isUser = true;
  public img = '';
  public name: string;
  public surname: string;
  public id: string;
  public phone: string;
  public age: string;
  public email: string;
  public address: string;
  // public base64Image: string;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private camera: Camera
  ) { }

  ngOnInit() {
    this.authService.getUser().then(user => {
      if (user.getImg()) {
        this.isEmpty = false;
        this.img = user.getImg();
      } else {
        this.isEmpty = true;
      }
      this.name = user.getName();
      this.surname = user.getSurname();
      this.phone = user.getPhone();
      this.email = user.getMail();
      this.authService.getUserType().then(isUser => {
        this.isUser = isUser;
        if(isUser){
          this.id = user.getCf();
          this.age = user.getAge();
        } else {
          this.id = user.getAlbo();
          this.address = user.getAddress();
        }
        this.isLoaded = true;
      });
    });

    this.menuCtrl.toggle();
  }

  private onSubmit(key: string[], value: string[], type: string) {
    const formData = new FormData();
    for (let i = 0; i < key.length; i++) {
      formData.append(key[i], value[i]);
    }
    this.userService.changeProfile(formData).subscribe(success => {
      success.subscribe(resData => {
        if (resData.status === 'ok') {
          this.authService.getUser().then(user => {
            if (type === 'addr') {
              user.setAddress(formData.get('address').toString());
              this.address = formData.get('address').toString();
            } else if (type === 'phone') {
              user.setPhone(formData.get('phone_number').toString());
              this.phone = formData.get('phone_number').toString();
            } else if (type === 'age') {
              user.setAge(formData.get('age').toString());
              this.age = formData.get('age').toString();
            }
            this.authService.saveUser();
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
            placeholder: user.getPhone(),
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
      targetHeight: 250,
      targetWidth: 250,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imageData) => {
      this.img = (<any>window).Ionic.WebView.convertFileSrc(imageData);
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
      correctOrientation: true
    };
    this.camera.getPicture(options).then(imgData => {
      console.log(imgData);
      this.updateImage(imgData);
      // this.base64Image = 'data:image/jpeg;base64,' + imgData;
      // this.user.setImg(this.base64Image);
    }, (err) => {
      console.log(err);
    });
  }

  private updateImage(imgData: string) {
    this.authService.getUser().then(user => {
      const formData = new FormData();
      formData.append('image', this.img);
      this.userService.changeProfile(formData).subscribe(success => {
        success.subscribe(resData => {
          if (resData.status === 'ok') {
            // update the storage if the media server is updated
            this.img = imgData;
            console.log(this.img);
            user.setImg(imgData);
            this.authService.saveUser();
          } else {
            this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
            console.log(this.img);
          }
        });
      });
    });
  }

}

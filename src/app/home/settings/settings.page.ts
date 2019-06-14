import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService.service';
import { MenuController, AlertController, Platform } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

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
  private DESTINATION_TYPE: number;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private camera: Camera,
    private platform: Platform,
    private file: File
  ) { }

  ngOnInit() {

    if (this.platform.is('ios')) {
      this.DESTINATION_TYPE = this.camera.DestinationType.NATIVE_URI;
    } else {
      this.DESTINATION_TYPE = this.camera.DestinationType.FILE_URI;
    }
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
        if (resData.status === 'ok') {
          this.authService.getUser().then(user => {
            if (type === 'addr' && user.hasOwnProperty('address')) {
              user['address'] = formData.get('address').toString();
              this.address = formData.get('address').toString();
            } else if (type === 'phone') {
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
            if (newp.length >= 8) {
              const key = ['old_password', 'new_password'];
              const value = [oldp, newp];
              this.onSubmit(key, value, 'psw');
            } else {
              this.alertCtrl.create({
                header: 'Error',
                message: 'Inserire password corretta: almeno 8 caratteri',
                buttons: [
                  {
                    text: 'OK'
                  }
                ]
              }).then(alert => {
                alert.present();
              });
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
      destinationType: this.DESTINATION_TYPE,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imgData) => {
      this.urlImgage = (<any>window).Ionic.WebView.convertFileSrc(imgData);
      this.uploadPhoto(imgData);
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
      destinationType: this.DESTINATION_TYPE,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then(imgData => {
      this.uploadPhoto(imgData);
    }, (err) => {
      console.log(err);
    });
  }

  private uploadPhoto(imgData: string) {
    if (imgData.length > 200) {
      this.base64Image = 'data:image/jpeg;base64,' + imgData;
      let formData = new FormData();
      formData.append('image', this.base64Image);
      this.userService.changeProfile(formData).subscribe(success => {
        success.subscribe(resData => {
          if (resData.status === 'ok') {
            this.urlImgage = resData.message; // url dell'immagine
            this.authService.getUser().then(user => {
              user.image = this.urlImgage;
              this.authService.setUser(user);
            });
          } else {
            this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
          }
        });
      });
    }
    else {
      this.file.resolveLocalFilesystemUrl(imgData).then(fileEntry => {
        let { name, nativeURL } = fileEntry;
        let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
        return this.file.readAsArrayBuffer(path, name);
      }).then(buffer => {
        let imgBlob = new Blob([buffer], {
          type: "image/jpeg"
        });
        const formData = new FormData();
        formData.append('file', imgBlob, 'image.png');
        this.userService.changeProfile(formData).subscribe(success => {
          success.subscribe(resData => {
            if (resData.status === 'ok') {
              this.urlImgage = resData.message; // url dell'immagine
              this.authService.getUser().then(user => {
                user.image = this.urlImgage;
                this.authService.setUser(user);
              });
            } else {
              this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
            }
          });
        });
      });
    }
  }

}

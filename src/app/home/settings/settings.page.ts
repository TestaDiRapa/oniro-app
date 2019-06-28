/**
 * This is the settings page that allows the user to modify some information, such as:
 * profile picture;
 * password;
 * address (if the user is a doctor);
 * phone number;
 * age.
 */
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService.service';
import { MenuController, AlertController, Platform } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ControllerService } from 'src/app/services/controllerService.service';

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
    private controllerService: ControllerService,
    private alertCtrl: AlertController,
    private camera: Camera,
    private platform: Platform,
    private file: File
  ) { }

  /**
   * This method allows to initialize the settings page. It retrieves the user information thanks to
   * the AuthenticationService. The information is displayed on the page.
   */
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

  /**
   * This methods allows to update the picture profile of the user, if it changes.
   * @param img The url of the Image as a string.
   */
  ionviewWillEnter(img: string) {
    this.base64Image = img;
  }

  /**
   * This is a private method called every time the user changes his personal information.
   * All the changes are reflected on the dabatase thanks to the UserService, and on the
   * storage thanks to the AuthenticationService.
   * @param key An array of keys corresponding to the user information he wants to change.
   * @param value The value associated with the key.
   * @param type The type about the user information changed.
   */
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
            this.controllerService.createAlertCtrl('Success', 'Cambiamento effettuato!');
          });
        } else {
          this.controllerService.createAlertCtrl('Error', resData.message);
        }
      });
    });
  }

  /**
   * This method is called every time a user wants to modify his age.
   */
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

  /**
   * This method is called every time a user wants to modify his phone number.
   */
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

  /**
   * This method is called every time a user wants to modify his password.
   */
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

  /**
   * This method is called every time a user wants to modify his address.
   */
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

  /**
   * This method is called when the user clicks on the Camera button.
   * It allows the user to takes a photo in order to update the profile picture.
   */
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
      this.urlImgage = (window as any).Ionic.WebView.convertFileSrc(imgData);
      this.uploadPhoto(imgData);
      this.isEmpty = false;
    }, (err) => {
      this.controllerService.createAlertCtrl('Error', err);
    });
  }

  /**
   * This method is called when the user clicks on the Gallery button.
   * It allows to choose a new image in the phone gallery, to update the profile picture.
   */
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
      this.isEmpty = false;
    }, (err) => {
      this.controllerService.createAlertCtrl('Error', err);
    });
  }

  /**
   * This method allows to udate the profile picture in real-time in the page, in the server
   * thanks to UserService, and in the storage thanks to AuthenticationService.
   * The method check if the imgData is a path or a base64 Image.
   * The Image is updated in the storage if and only if the server has updated it before.
   *
   * @param imgData The url of the Image as a string.
   */
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
              this.ionviewWillEnter('data:image/jpeg;base64,' + imgData);
            });
          } else {
            this.controllerService.createAlertCtrl('Error', resData.message);
          }
        });
      });
    } else {
      this.file.resolveLocalFilesystemUrl(imgData).then(fileEntry => {
        let { name, nativeURL } = fileEntry;
        let path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));
        return this.file.readAsArrayBuffer(path, name);
      }).then(buffer => {
        let imgBlob = new Blob([buffer], {
          type: 'image/jpeg'
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
                this.ionviewWillEnter('data:image/jpeg;base64,' + imgData);
              });
            } else {
              this.controllerService.createAlertCtrl('Error', resData.message);
            }
          });
        });
      });
    }
  }

}

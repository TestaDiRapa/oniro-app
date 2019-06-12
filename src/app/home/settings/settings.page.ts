import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userService.service';
import { Paziente } from '../../register/paziente.model';
import { MenuController, AlertController } from '@ionic/angular';
import { Medico } from '../../register/medico.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {
  public user: Paziente | Medico;
  public isEmpty: boolean;
  public isUser = false;
  public isLoaded = false;
  public img: string;
  public base64Image: string;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private camera: Camera,
  ) { }

  ngOnInit() {
    this.userService.getUser().then(user => {
      this.user = user;
      if (this.user.getImg()) {
        this.isEmpty = false;
        this.img = this.user.getImg();
      } else {
        this.isEmpty = true;
      }
      this.authService.getUserType().then(userType => {
        this.isUser = userType;
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
          if (type === 'addr') {
            this.user.setAddress(formData.get('address').toString());
          } else if (type === 'phone') {
            this.user.setPhone(formData.get('phone_number').toString());
          } else if (type === 'age') {
            this.user.setAge(formData.get('age').toString());
          }
          this.userService.setUser(this.user);
          this.alertCtrl.create({ header: 'Cambiamento effettuato!' }).then(alert => alert.present());
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
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imgData) => {
      this.img = (<any>window).Ionic.WebView.convertFileSrc(imgData);
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
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };
    this.camera.getPicture(options).then(imgData => {
      
      this.img = imgData;
      this.uploadImage(imgData);
      
     // this.base64Image = 'data:image/jpeg;base64,' + imgData;
     // window.atob(this.base64Image);




    }, (err) => {
      console.log(err);
    });
  }

  
  private uploadImage(imageFileUri: any) {
    console.log("in upload image");
    console.log("FILE URI: " + this.img);
    window['resolveLocalFileSystemURL'](imageFileUri,
      entry => {
        entry['file'](file => {
          console.log("prima di read file: \n " + file);
          this.readFile(file)});
      });
  }


  private readFile(file: any) {
    console.log("readfile method");
    const reader = new FileReader();
    const formData = new FormData();
    // formData.append("file", { uri: "file://path/to/image.png", type: "image/png" });
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], { type: file.type });
      console.log("result reader:  " + reader.result);
      console.log("tupe: -- " + file.type);
      formData.append('file', imgBlob, file.name);
      this.requestPost(formData);
    };
    reader.readAsArrayBuffer(file);
  }

    private requestPost(formData: FormData){
    this.userService.changeProfile(formData).subscribe(success => {
      success.subscribe(resData => {
        if (resData.status === 'ok') {
          console.log("OOOOOOOOOOOOOOOOOK \n");
          console.log(this.img);
          this.base64Image = 'data:image/jpeg;base64,' + this.img;
          this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
          // update the storage if the media server is updated
          //this.img = imgData;
          //console.log(this.img);
          //this.user.setImg(imgData);
          //this.userService.setUser(this.user);
        } else {
          this.alertCtrl.create({ header: resData.message }).then(alert => alert.present());
          console.log("OH nooooooooo \n");
          console.log(this.img);
        }
      });
    });
  }
  

}

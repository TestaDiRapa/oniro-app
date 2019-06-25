/** This component allows the user to
 *
 */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, AlertController } from '@ionic/angular';
import { GetCoordService } from '../../services/get-coord.service';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapOptions,
  Environment,
  Geocoder,
  GeocoderResult,
  LocationService,
  MyLocation,
  BaseArrayClass,
  Marker,
  GeocoderRequest
} from '@ionic-native/google-maps/ngx';
import { UserService } from 'src/app/services/userService.service';
import { ControllerService } from 'src/app/services/controllerService.service';

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.page.html',
  styleUrls: ['./gmaps.page.scss'],
})
export class GmapsPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  doctors: object[] = [];
  addresses: string[] = [];
  myLoc;
  color = '#07306D';
  google;
  add: string [] = [];

  constructor(
    private menuCtrl: MenuController,
    private getCoord: GetCoordService,
    private controllerService: ControllerService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.menuCtrl.close();
  }

  ionViewWillEnter() {
    Environment.setBackgroundColor('#07306D');
    this.loadMap();
  }

  loadMap() {
    let options: GoogleMapOptions;
    LocationService.getMyLocation().then((myLocation: MyLocation) => {
      this.myLoc = myLocation;
      options = {
        controls: {
          compass: true,
          myLocationButton: true,
          myLocation: true,   // (blue dot)
          indoorPicker: true,
          mapToolbar: true,
          zoom: true,
        },
        gestures: {
          scroll: true,
          tilt: true,
          zoom: true,
          rotate: true
        },
        camera: {
          target: myLocation.latLng
        },
      };
      this.map = GoogleMaps.create('map', options);
      this.map.animateCamera({
        target: myLocation.latLng,
        zoom: 17
      }).then(() => {
      });
    });
    this.getCoordinates();
  }

  findDoctors() {
let opt: GeocoderRequest = {
  address: this.addresses
}

Geocoder.geocode(opt).then((mvcArray: BaseArrayClass<GeocoderResult[]>) => {
    mvcArray.on('finish').subscribe(() => {
      if (mvcArray.getLength() > 0) {
        const results = mvcArray.getArray();
        console.log('mvcArray lenght ',mvcArray.getLength());
        console.log('result lenght ', results.length);
        let i = 0;
        results.forEach((result: GeocoderResult[]) => {
          this.map.addMarkerSync({
            position: result[0].position,
            title: this.doctors[i]['name'] + ' ' + this.doctors[i]['surname']
          });
          i++;
        });
      }
      else{
        console.log('non sei capace');
      }
    });
  });
  }

    private getCoordinates() {
      this.getCoord.getCoordinates().then(observable => {
        observable.subscribe(res => {
          // tslint:disable: no-string-literal
          const doctmp = res['payload'];
          for (const doctor of doctmp) {
            console.log(doctor['doctor']['address']);
            this.addresses.push(doctor['doctor']['address']);
            let tmp = {
              id: doctor['doctor']['_id'],
              name: doctor['doctor']['name'],
              surname: doctor['doctor']['surname'],
              address: doctor['doctor']['address']
            };
            this.doctors.push(tmp);
          }
          for(let addr of this.addresses)
          this.add.push(addr);
        });
      });
  }

  onSendRequest(idDoc: string) {
    this.userService.sendRequestToDoc(idDoc).then(success => {
      success.subscribe(resData => {
        if (resData.status === 'ok') {
          this.controllerService.createAlertCtrl('Success', 'Richiesta effettuata con successo!');
        } else {
          this.controllerService.createAlertCtrl('Error', resData.message);
        }
      });
    });
  }
}

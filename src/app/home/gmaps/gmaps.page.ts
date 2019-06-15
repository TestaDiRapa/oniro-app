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
  BaseArrayClass
} from '@ionic-native/google-maps';
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
  doctors: any[];
  addresses: string[] = [];
  myLoc;
  color = '#07306D';

  constructor(
    private menuCtrl: MenuController,
    private getCoord: GetCoordService,
    private alertCtrl: AlertController,
    private controllerService: ControllerService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.getCoordinates();
  }

  ionViewWillEnter() {
    Environment.setBackgroundColor('#07306D');
  }

  loadMap() {
    // const myPosition = this.geolocation.getCurrentPosition();
    /*   this.geolocation.getCurrentPosition().then((resp) => {
         const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
         const mapOptions = {
           center: latLng,
           zoom: 15,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         };
         this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
         let marker: Marker
       }).catch((error) => {
         console.log('Error getting location', error);
       });*/
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
          zoom: true
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
    this.findDoctors();
  }

  private findDoctors() {
    Geocoder.geocode({
      address: this.addresses
    }).then((mvcArray: BaseArrayClass<GeocoderResult[]>) => {
      console.log('ehi');
      mvcArray.on('finish').subscribe(() => {
        if (mvcArray.getLength() > 0) {
          console.log('lunghezza ', mvcArray.getLength());
          const results: any[] = mvcArray.getArray();
          results.forEach((result: GeocoderResult[]) => {
            this.map.addMarkerSync({
              position: result[0].position,
              title: JSON.stringify(result)
            });
          });
        } else {
          console.log('lunghezza zero');
        }
      });
    });
  }

  private getCoordinates() {
    this.getCoord.getCoordinates().then(observable => {
      observable.subscribe(res => {
        // tslint:disable: no-string-literal
        this.doctors = res['payload'];
        console.log(res['payload']);
        for (const doctor of this.doctors) {
          this.addresses.push(doctor['address']);
        }
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

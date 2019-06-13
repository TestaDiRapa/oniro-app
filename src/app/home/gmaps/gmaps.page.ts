import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';
import { GetCoordService } from '../../services/get-coord.service';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  Geocoder,
  GeocoderResult,
  LocationService,
  MyLocation,
  GoogleMapsMapTypeId,
  BaseArrayClass
} from '@ionic-native/google-maps';
declare var google;

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.page.html',
  styleUrls: ['./gmaps.page.scss'],
})
export class GmapsPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  doctors: any [];
  addresses: string [] = [] ;
  myLoc;

  constructor(
    private geolocation: Geolocation,
    private menuCtrl: MenuController,
    private getCoord: GetCoordService
  ) { }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.getCoordinates();
    this.loadMap();
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
    });**/
let options: GoogleMapOptions;
LocationService.getMyLocation().then((myLocation: MyLocation) => {
  this.myLoc = myLocation;
  options = {
  controls: {
    compass: true,
    myLocationButton: true,
    myLocation: true,   // (blue dot)
    indoorPicker: true
  },
  gestures: {
    scroll: true,
    tilt: true,
    zoom: true,
    rotate: true
  },
      camera: {
        target: myLocation.latLng
      }
    };
  this.map = GoogleMaps.create('map', options);
  this.map.animateCamera({
      target: myLocation.latLng,
     zoom: 17
    }).then(() => {
    });
  });
  }

  findDoctors() {
    Geocoder.geocode({
          address: ['Rome,Italy' ]
        }).then((mvcArray: BaseArrayClass<GeocoderResult[]>) => {
          console.log('ehi');
          mvcArray.on('finish').subscribe(() => {
            if (mvcArray.getLength() > 0) {
              const results: any[] =  mvcArray.getArray();
              results.forEach((result: GeocoderResult[]) => {
                this.map.addMarkerSync({
                  position: this.myLoc.latLng,
                  title:  JSON.stringify(result)
                });
              });
            } else {
              console.log('lunghezza zero');
            }
          });
        });
  }

  getCoordinates() {
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
}

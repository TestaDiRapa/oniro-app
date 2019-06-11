import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';
import { GetCoordService } from './get-coord.service';
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
  MyLocation
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
  doctors: any;
  addresses: string [] ;

  constructor(
    private geolocation: Geolocation,
    private menuCtrl: MenuController,
    private getCoord: GetCoordService
  ) { }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.getCoordinates();
  }

  loadMap() {
    //const myPosition = this.geolocation.getCurrentPosition();
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
    let opzioni: GoogleMapOptions;
    LocationService.getMyLocation().then((myLocation: MyLocation) => {

// tslint:disable-next-line: label-position
     /* opzioni = {
        camera: {
          target: myLocation.latLng,
          zoom: 50
        },
      }*/
      this.map = GoogleMaps.create('map');
      let marker :Marker = this.map.addMarkerSync({
        'position': myLocation.latLng,
        'title': 'Hai aggiunto un Marker'
      });
      this.map.animateCamera({
        target: marker.getPosition(),
        zoom:17
      }).then(() => {
        marker.showInfoWindow();
      })
  }); 
   /* for (const doctor of this.doctors) {
      this.addresses.push(doctor['address']);
    }*/
    
   /* const marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });*/
    
}

  getCoordinates() {
    console.log('sono qui');
    this.getCoord.getCoordinates().then(observable => {
      observable.subscribe(res => {
        // tslint:disable: no-string-literal
        this.doctors = res['payload'];
        console.log(res['payload']);
      });
    });
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.page.html',
  styleUrls: ['./gmaps.page.scss'],
})
export class GmapsPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(private geolocation: Geolocation,
    private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
}
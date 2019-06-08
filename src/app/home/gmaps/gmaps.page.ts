import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';
import { GetCoordService } from './get-coord.service';

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
              private menuCtrl: MenuController,
              private getCoord:GetCoordService) { }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  getCoordinates() {
    console.log('sono qui');
    this.getCoord.getCoordinates().subscribe(res =>{
      console.log(res);
    });
  }

}

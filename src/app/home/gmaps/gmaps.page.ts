/** This component allows the patient to see, on the map, where are the doctors near him.
 * It allows also to contanct them, sending a request to become a new patient.
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
  GeocoderRequest
} from '@ionic-native/google-maps/ngx';
import { UserService } from 'src/app/services/userService.service';
import { ControllerService } from 'src/app/services/controllerService.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Router } from '@angular/router';

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
    private userService: UserService,
    private diagnostic: Diagnostic,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

    ngOnInit() {
      this.menuCtrl.close();
    }
/**
 * Each time the page is loaded the map is load.
 */
    ionViewWillEnter() {
      Environment.setBackgroundColor('#07306D');
      //check if the location is enabled
      this.diagnostic.isGpsLocationEnabled().then((enabled) => {
        if (enabled) {
          this.diagnostic.isLocationEnabled().then((enb) => {
            if (enb) {
              this.loadMap(); //show the map
            }
          });
        } else { //show an alert error
          this.alertCtrl.create({
            header: 'Errore',
            message: 'Abilita la localizzazione se vuoi vedere la mappa',
            buttons: [{
              text: 'OK',
              handler: () => {
                this.router.navigate(['/home']);
              }
            }]
          }).then(alert => {
            alert.present();
          });
        }
      });
    }
/** Create the map, find my position and center the map on my position
 * 
 */
    loadMap() {
      let options: GoogleMapOptions;
      //get my position
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
        //create the map and center it
        this.map = GoogleMaps.create('map', options);
        this.map.animateCamera({
          target: myLocation.latLng,
          zoom: 17
        }).then(() => {
        });
      });
      // get doctor addresses
      this.getCoordinates();
    }
/**This method convert addresses in coordinates and add marker to each address
 * 
 */
    findDoctors() {
      let opt: GeocoderRequest = {
        address: this.addresses
      };
      Geocoder.geocode(opt).then((mvcArray: BaseArrayClass<GeocoderResult[]>) => {
        mvcArray.on('finish').subscribe(() => {
          if (mvcArray.getLength() > 0) {
            const results = mvcArray.getArray();
            let i = 0;
            results.forEach((result: GeocoderResult[]) => {
              this.map.addMarkerSync({
                position: result[0].position,
                title: this.doctors[i]['name'] + ' ' + this.doctors[i]['surname'] //the text of the marker
              });
              i++;
            });
          }
        });
      });
    }
/**
 * Make a server request to obtain addresses and store the information
 */
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
          for (let addr of this.addresses) {
            this.add.push(addr);
          }
        });
      });
    }
/** This method allows a patient to send a 'request to become patient' to the doctor.
 * 
 * @param idDoc the doctor identifier to whom the patient make the request
 */
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


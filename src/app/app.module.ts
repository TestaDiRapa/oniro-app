import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { SelectDevicePageModule } from './home/record/select-device/select-device.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
//import { File } from '@ionic-native/file/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SelectDevicePageModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    //File,
    BackgroundMode,
    BluetoothSerial,
    Network,
    StatusBar,
    SplashScreen,
    CallNumber,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

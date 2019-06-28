/*
 *This service is used to use the Loader and Alert Controllers
 */
import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  isLoading = false;

  constructor(private loadingController: LoadingController, private alertCtrl: AlertController) { }

  // Start a loader controller
  async onCreateLoadingCtrl() {
    return await this.loadingController.create({
      message: 'Attendi...',
      translucent: true,
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });

  }

   // Stop the loader
  onDismissLoaderCtrl() {
    this.isLoading = false;
    this.loadingController.dismiss();
  }

   // Create an Alert Controller
  createAlertCtrl(head: string, mess: string) {
      this.alertCtrl.create({
          header: head,
          message: mess,
          buttons: [{
              text: 'OK'
          }]
      }).then(alert => {
          alert.present();
      });
  }

}

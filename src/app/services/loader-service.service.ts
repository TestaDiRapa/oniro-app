import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading = false;


  constructor(
    public loadingController: LoadingController,

  ) { }


  async onCreate() {
    return await this.loadingController.create({
      message: 'Please wait...',
      translucent: true,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });

  }

  onDismiss() {
    this.isLoading = false;
    this.loadingController.dismiss();
  }


}

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
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });

  }

  onDismiss() {
    this.isLoading = false;
    this.loadingController.dismiss();
  }


}

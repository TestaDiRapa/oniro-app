import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../services/doctorService.service';
import { LoaderService } from '../services/loader-service.service';

@Component({
  selector: 'app-homedoc',
  templateUrl: './homedoc.page.html',
  styleUrls: ['./homedoc.page.scss'],
})
export class HomedocPage implements OnInit {
  public alerts: any[];
  public n_req: number;

  constructor(
    private docService: DoctorService,
    private loadingController: LoaderService) 
    { }

ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadingController.onCreate();
    this.docService.getMessagePatient().then(succes => {
      succes.subscribe(resData => {
        console.log(resData);
        this.alerts = resData['signals'];
        this.n_req = this.alerts.length;
      });
    });
    this.loadingController.onDismiss();
  }

}


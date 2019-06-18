import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Data, Router } from '@angular/router';
import {
  AuthenticationService,
  Respons
} from 'src/app/services/authentication/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ChartsService } from 'src/app/services/charts.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.page.html',
  styleUrls: ['./patient.page.scss']
})
export class PatientPage implements OnInit {
  private url = 'http://' + environment.serverIp + '/user/my_recordings?cf=';
  patientRecords: Data[] = [];
  cf: string;

  constructor(
    private activatedRouter: ActivatedRoute,
    private authService: AuthenticationService,
    private http: HttpClient,
    private charts: ChartsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe((params: Params) => {
      this.cf = params.cf;
      this.authService.token.then(token => {
        this.http
          .get<Respons>(this.url + params.cf, {
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + token
            })
          })
          .subscribe(res => {
            this.patientRecords = res['payload'];
          });
      });
    });
  }

  getMoreDetails(id: string) {
    const date = id.toString().substr(0, 10);
    this.charts.cf = this.cf;
    this.charts.dataId = id;
    this.charts.currentDate = date;
    this.router.navigate(['/homedoc/lista-diario-pazienti/pazienti/', this.cf, id]);
  }

}

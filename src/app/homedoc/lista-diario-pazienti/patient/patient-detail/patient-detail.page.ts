import { Component, OnInit } from '@angular/core';
import { ChartsService } from 'src/app/services/charts.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.page.html',
  styleUrls: ['./patient-detail.page.scss'],
})
export class PatientDetailPage implements OnInit {
cf: string;
date: string;
  constructor(private charts: ChartsService) { }

  ngOnInit() {
    this.cf = this.charts.cf;
    this.date = this.charts.dataId;
    this.charts.data.then()
  }
}

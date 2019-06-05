import { Component, OnInit } from '@angular/core';
import { Paziente } from '../paziente';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private paziente: Paziente;
  constructor(
    
  ) { }

  ngOnInit() {

  }

}

import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { HomePage } from '../home.page';
import { NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {
    this.menuCtrl.toggle();
  }

}

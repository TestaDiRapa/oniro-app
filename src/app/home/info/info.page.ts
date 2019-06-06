import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

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

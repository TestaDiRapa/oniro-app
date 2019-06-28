/*
* This class represents a list of contacts of the patient. Thanks to this class it is
* possible to contact a doctor (an associated doctor). The plugin used to allow this
* behaviour is "call-number".
*/
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';
import { MenuController, AlertController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ControllerService } from 'src/app/services/controllerService.service';
import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})


export class ContactsPage implements OnInit {
  public contacts: any[] = [];

  constructor(
    private alertCtrl: AlertController,
    private call: CallNumber,
    private controlService: ControllerService,
    private menuCtrl: MenuController,
    private network: Network,
    private router: Router,
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.menuCtrl.close();
  }

  ionViewWillEnter() {
    if (this.network.type === this.network.Connection.NONE) {
      this.alertCtrl.create({
        header: 'Error',
        message: 'È necessaria una connessione a internet per accedere a questa funzione',
        buttons: [{
          text: 'Ok',
          handler: () => { this.router.navigate(['/home']); }
        }]
      }).then(alert => { alert.present(); });
    } else {
      this.getContact();
    }
  }

  /**
   * This method calls the "getMyDoctor service". It allows to get all the contacts of the
   * patient and update the "contacts" list every time this page is created.
   */
  private getContact() {
    this.contacts = [];
    this.controlService.onCreateLoadingCtrl();
    this.userService.getMyDoctor().then(success => {
      success.subscribe(res => {
        this.controlService.onDismissLoaderCtrl();
        for (let i = 0; i < res['message'].length; i++) {
          if (res['message'][i]['type'] === 'subscribed') {
            this.contacts.push(res['message'][i]);
          }
        }
      });
    });
    this.controlService.onDismissLoaderCtrl();
  }

  /**
   * This method is called every time the patient wants to call a doctor.
   * @param phone The phone number to call as string.
   * @returns {Promise<any>}
   */
  async callNumber(phone: string): Promise<any> {
    try {
      await this.call.callNumber(phone, true);
    } catch (e) {
      console.error(e);
    }
  }

}

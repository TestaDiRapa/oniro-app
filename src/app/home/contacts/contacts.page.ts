/*
* This class represents a list of contacts of the patient. Thanks to this class it is
* possible to contact a doctor (an associated doctor). The plugin used to allow this
* behaviour is "call-number".
*/
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';
import { MenuController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ControllerService } from 'src/app/services/controllerService.service';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})


export class ContactsPage implements OnInit {
  public contacts: any;

  constructor(
    private userService: UserService,
    private menuCtrl: MenuController,
    private controlService: ControllerService,
    private call: CallNumber) {
  }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.getContact();
  }

  /**
  * This method calls the "getMyDoctorService". It allows to get all the contacts of the
  * patient and update the "contacts" list every time this page is created.
  */
  private getContact() {
    this.controlService.onCreateLoadingCtrl();
    this.userService.getMyDoctor().then(success => {
      success.subscribe(res => {
        this.contacts = res.message;
        this.controlService.onDismissLoaderCtrl();
      });
    });
    this.controlService.onDismissLoaderCtrl();
  }

  /**
  * This method is called every time the patient wants to call a doctor.
  * 
  * @param {string} phone The phone number to call as string
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

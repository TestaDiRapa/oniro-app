import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';
import { MenuController } from '@ionic/angular';
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})


export class ContactsPage implements OnInit {
  public contacts: any;

  constructor(
    private user: UserService,
    private menuCtrl: MenuController,
    private call: CallNumber) {
  }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.getContact();
  }

  getContact() {
    this.user.getMyDoctor().then(success => {
      success.subscribe(res => {
        this.contacts = res.message;
        console.log(res.message);
// tslint:disable-next-line: no-string-literal
        console.log(res.message['doctor']);
        console.log(this.contacts);
        console.log(this.contacts[0]);
      });
    });
  }
/*
  contactClick( phone: string) {
      this.callNumber.callNumber(phone, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));

  }
  */

  async callNumber(phone: string): Promise<any> {
    try {
      await this.call.callNumber(phone, true);
    } catch (e) {
      console.error(e);
    }
  }

}

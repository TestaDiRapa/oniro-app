import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})


export class ContactsPage implements OnInit {
  public contacts: any;

  constructor(
    private user: UserService,
    private menuCtrl: MenuController) {
  }

  ngOnInit() {
    this.menuCtrl.toggle();
    this.getContact();
  }

  getContact() {
    this.user.getMyDoctor().subscribe(res => {
      this.contacts = res.message;
      console.log(res.message);
      console.log(res.message['doctor']);
      console.log(this.contacts);
      console.log(this.contacts[0]);


    });
  }

  contactClick(id: string, phone: string) {
      alert('This is the event: \n name: ' + id + '\n phone:  ' + phone );

  }

}

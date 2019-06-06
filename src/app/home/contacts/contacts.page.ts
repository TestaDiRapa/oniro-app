import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  public contacts: any;

  constructor(private user: UserService) {
    this.getContact();
  }

  ngOnInit() {
  }

  getContact() {
    this.user.getMyDoctor().subscribe(res => {
      console.log(res);
    });
  }

}

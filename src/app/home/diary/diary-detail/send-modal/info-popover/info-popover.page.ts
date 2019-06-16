import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-popover',
  templateUrl: './info-popover.page.html',
  styleUrls: ['./info-popover.page.scss'],
})
export class InfoPopoverPage implements OnInit {

  name: string;
  surname: string;
  address: string;
  phone_number: string;
  profile_picture: string;

  constructor() { }

  ngOnInit() {
  }

}

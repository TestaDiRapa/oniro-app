/**
 * This PopOver is shown every time the patient wants to know the notified doctors.
 */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-send-popover',
  templateUrl: './send-popover.component.html',
  styleUrls: ['./send-popover.component.scss'],
})
export class SendPopoverComponent implements OnInit {

  doctors: string[];

  constructor() { }

  ngOnInit() {}

}

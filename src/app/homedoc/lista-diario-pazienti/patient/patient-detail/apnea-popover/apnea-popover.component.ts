/**
 * This is the PopOver that is shown when the doctor keeps pressed on an apnoea event.
 */
import { Component, OnInit } from '@angular/core';
import { ApneaEvent } from 'src/app/services/bluetooth/data-storage/apnea-event.model';

@Component({
  selector: 'app-apnea-popover',
  templateUrl: './apnea-popover.component.html',
  styleUrls: ['./apnea-popover.component.scss'],
})
export class ApneaPopoverComponent implements OnInit {

  events: ApneaEvent[];

  constructor() { }

  ngOnInit() {}

}

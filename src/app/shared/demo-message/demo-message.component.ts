import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-demo-message',
  template: `
	<div class="demo topleft triangle-topleft" *ngIf="showDemo">
		<span class="demo topleft demo-text">{{msg}}</span>
	</div>
  `,
  styleUrls: ['./demo-message.component.scss']
})
export class DemoMessageComponent implements OnInit {

	showDemo: boolean;
	msg = environment.envName;

  constructor() { }

  ngOnInit() {
    this.showDemo = (environment.envName !== 'production') ? true : false;
  }

}

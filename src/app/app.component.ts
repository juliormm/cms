import { Component } from '@angular/core';


@Component({
  selector: 'lin-app',
  template: `
        <router-outlet></router-outlet>
        <app-demo-message></app-demo-message>
    `,
  styleUrls: ['./app.component.css'],
  providers: []
})
export class AppComponent {
    constructor() {}
}

import { Component } from '@angular/core';
import { LoadingService } from '../../core/loading.service';


@Component({
    selector: 'lin-loading',
    template: `
    <div id="loader-wrapper" *ngIf="show">
      <div id="loader-center">
      <div class="loader"></div>
      </div>   
    </div>
  
   `,
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

    show: boolean;

    constructor(private loading: LoadingService) {
        loading.obs$.subscribe(data => {
            this.show = data.display;
        })
    }

}

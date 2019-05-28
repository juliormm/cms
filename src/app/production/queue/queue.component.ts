import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/authentication.service';
import { QueueDataService, IQueueData } from '../../core/queue-data.service';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss']
})
export class QueueComponent implements OnInit {

  trackData: IQueueData[];
  userData: any;
  subscriptions: Subscription;

  constructor(private auth: AuthenticationService, private queueService: QueueDataService) { }

  ngOnInit() {
    this.userData = this.auth.getUser();
    this.subscriptions = new Subscription();

    this.subscriptions.add(this.queueService.currentData.subscribe(data => this.trackData = data));
  }

  ngOnDestroy(){
    this.trackData = null;
    this.userData = null;
    this.subscriptions.unsubscribe();
  }
}

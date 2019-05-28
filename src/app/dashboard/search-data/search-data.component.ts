import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


@Component({
    selector: 'search-data',
    templateUrl: './search-data.component.html',
    styleUrls: ['./search-data.component.scss']
})
export class SearchDataComponent implements OnInit {

   	resultList: Observable<any>;
   	campaignSelected:string = '';
    constructor(private api:ApiService, private router:Router) {}

    ngOnInit() {

    	this.resultList = Observable
            .create((observer: any) => {
            	if(this.campaignSelected){
                    this.api.getData('sapi/search/data/' + this.campaignSelected.split(' ').join('/'), false)
                    .subscribe((result: any) => {
                        if ('failed' in result) {
                            observer.next([]);
                        } else {
                            observer.next(result);
                        }
                    })
                }
                
            });

    }

    selectedCampaign(event){
        this.router.navigate(['/dashboard/production/campaign/'+event.item.id]);
        this.campaignSelected = '';
    }

}

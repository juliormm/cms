import { Component, OnInit, Input } from '@angular/core';
// import { Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { iTagInsertResponse } from '../../_interfaces/manage.interface';
import { TypeheadTagsService } from '../../core/typehead-tags.service';

@Component({
  selector: 'campaign-tags',
  templateUrl: './campaign-tags.component.html',
  styleUrls: ['./campaign-tags.component.scss']
})
export class CampaignTagsComponent implements OnInit {

  resultList: Observable<any>;
  tagSelected = '';
  @Input() tagList: string[];
  @Input() vertical: number;
  @Input() campaignID: number;
  @Input() stacked = false;
  @Input() afix = false;
  expandFloat = false;

  internalList: string[];
  typeaheadNoResults = false;
  typeheadActive = true;

  verticalList = [
  { id: 1, name: "Automotive" },
  { id: 2, name: "Beverages" },
  { id: 3, name: "Education" },
  { id: 4, name: "Entertainment" },
  { id: 5, name: "Financial Services" },
  { id: 6, name: "Government" },
  { id: 7, name: "Grocery/Food Items" },
  { id: 8, name: "Health & Beauty" },
  { id: 9, name: "Home Improvement" },
  { id: 10, name: "Lottery/Gambling" },
  { id: 11, name: "Media/Communications" },
  { id: 12, name: "Medical" },
  { id: 13, name: "NonProfits/Community" },
  { id: 14, name: "PDProg/DirResponse" },
  { id: 15, name: "Political" },
  { id: 16, name: "Real Estate" },
  { id: 17, name: "Restaurants" },
  { id: 18, name: "Retail/Stores" },
  { id: 19, name: "Services" },
  { id: 20, name: "Station" },
  { id: 21, name: "Technology" },
  { id: 22, name: "Trade Organizations" },
  { id: 23, name: "Travel & Leisure" },
  { id: 24, name: "Utilities" }];


  constructor(private api: ApiService, public _tagServ: TypeheadTagsService) { }

  ngOnInit() {
    this.internalList = this.tagList;
    this.resultList = this._tagServ.tagList$;
  }


  selectTag(event) {
    // console.log(value)
    const data = { tags: event.value };
    this.apiTag(data);
  }

  keyEntered(event, value) {
    this.typeheadActive = (value.indexOf(',') === -1) ? true : false;
  }

  insertTags(value) {
    const data = { tags: value };
    this.apiTag(data)
  }

  deleteCampaignTags(value) {
    const testList = { tags: [value] };
    this.api.updateData('sapi/manage/campaign/' + this.campaignID + '/tags', testList)
      .subscribe(data => {
        this.internalList = data;
      });
  }

  apiTag(data) {

    this.api.insertData('sapi/manage/campaign/' + this.campaignID + '/tags', data, false, true, false)
      .subscribe((result: iTagInsertResponse) => {
        this.tagSelected = '';
        if (result.failed) {
          console.log('no')
          this.tagSelected = result.failed.join(', ');
        }
        if (result.success) {
          result.success.forEach(elem => {
            if (this.internalList.indexOf(elem) === -1) {
              this.internalList.push(elem);
            }

          })

        }
      })
  }

  onToggleTagging() {
    this.expandFloat = !this.expandFloat;
  }


  saveVertical(vID) {
    this.api.getData('sapi/manage/campaign/' + this.campaignID + '/' + vID).subscribe(data => {
      console.log(data);
    });
  }

}

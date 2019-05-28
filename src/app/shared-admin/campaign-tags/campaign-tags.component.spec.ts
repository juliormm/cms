import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignTagsComponent } from './campaign-tags.component';

describe('CampaignTagsComponent', () => {
  let component: CampaignTagsComponent;
  let fixture: ComponentFixture<CampaignTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

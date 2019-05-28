import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionStatusDetailComponent } from './revision-status-detail.component';

describe('RevisionStatusDetailComponent', () => {
  let component: RevisionStatusDetailComponent;
  let fixture: ComponentFixture<RevisionStatusDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevisionStatusDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionStatusDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

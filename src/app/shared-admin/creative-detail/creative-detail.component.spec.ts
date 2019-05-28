import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeDetailComponent } from './creative-detail.component';

describe('CreativeDetailComponent', () => {
  let component: CreativeDetailComponent;
  let fixture: ComponentFixture<CreativeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

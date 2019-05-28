import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAmListComponent } from './form-am-list.component';

describe('FormAmListComponent', () => {
  let component: FormAmListComponent;
  let fixture: ComponentFixture<FormAmListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAmListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

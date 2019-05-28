import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeFormControllerComponent } from './creative-form-controller.component';

describe('CreativeFormControllerComponent', () => {
  let component: CreativeFormControllerComponent;
  let fixture: ComponentFixture<CreativeFormControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeFormControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeFormControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

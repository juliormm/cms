import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueCountComponent } from './value-count.component';

describe('ValueCountComponent', () => {
  let component: ValueCountComponent;
  let fixture: ComponentFixture<ValueCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

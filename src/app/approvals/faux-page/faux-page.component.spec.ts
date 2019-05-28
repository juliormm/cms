/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FauxPageComponent } from './faux-page.component';

describe('FauxPageComponent', () => {
  let component: FauxPageComponent;
  let fixture: ComponentFixture<FauxPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FauxPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FauxPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

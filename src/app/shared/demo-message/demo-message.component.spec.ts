import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoMessageComponent } from './demo-message.component';

describe('DemoMessageComponent', () => {
  let component: DemoMessageComponent;
  let fixture: ComponentFixture<DemoMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

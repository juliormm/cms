import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeOptionsComponent } from './creative-options.component';

describe('CreativeOptionsComponent', () => {
  let component: CreativeOptionsComponent;
  let fixture: ComponentFixture<CreativeOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeArrayComponent } from './creative-array.component';

describe('CreativeArrayComponent', () => {
  let component: CreativeArrayComponent;
  let fixture: ComponentFixture<CreativeArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

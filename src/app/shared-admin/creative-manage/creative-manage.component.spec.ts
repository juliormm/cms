import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreativeManageComponent } from './creative-manage.component';

describe('CreativeManageComponent', () => {
  let component: CreativeManageComponent;
  let fixture: ComponentFixture<CreativeManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreativeManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreativeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

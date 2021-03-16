import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverManagmentComponent } from './driver-managment.component';

describe('DriverManagmentComponent', () => {
  let component: DriverManagmentComponent;
  let fixture: ComponentFixture<DriverManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleManagmentComponent } from './vehicle-managment.component';

describe('VehicleManagmentComponent', () => {
  let component: VehicleManagmentComponent;
  let fixture: ComponentFixture<VehicleManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

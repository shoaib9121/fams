import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupVehiclesComponent } from './group-vehicles.component';

describe('GroupVehiclesComponent', () => {
  let component: GroupVehiclesComponent;
  let fixture: ComponentFixture<GroupVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

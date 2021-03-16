import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackingDrawerComponent } from './time-tracking-drawer.component';

describe('TimeTrackingDrawerComponent', () => {
  let component: TimeTrackingDrawerComponent;
  let fixture: ComponentFixture<TimeTrackingDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeTrackingDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeTrackingDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

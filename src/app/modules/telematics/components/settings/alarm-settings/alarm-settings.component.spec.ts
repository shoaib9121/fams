import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmSettingsComponent } from './alarm-settings.component';

describe('AlarmSettingsComponent', () => {
  let component: AlarmSettingsComponent;
  let fixture: ComponentFixture<AlarmSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

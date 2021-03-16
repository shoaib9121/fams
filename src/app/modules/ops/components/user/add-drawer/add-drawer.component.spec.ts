import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDrawerComponent } from './add-drawer.component';

describe('AddDrawerComponent', () => {
  let component: AddDrawerComponent;
  let fixture: ComponentFixture<AddDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

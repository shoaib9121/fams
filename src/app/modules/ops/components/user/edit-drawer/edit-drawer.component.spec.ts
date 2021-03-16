import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDrawerComponent } from './edit-drawer.component';

describe('EditDrawerComponent', () => {
  let component: EditDrawerComponent;
  let fixture: ComponentFixture<EditDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

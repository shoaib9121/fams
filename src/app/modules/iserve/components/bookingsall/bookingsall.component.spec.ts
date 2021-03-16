import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsallComponent } from './bookingsall.component';

describe('BookingsallComponent', () => {
  let component: BookingsallComponent;
  let fixture: ComponentFixture<BookingsallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingsallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

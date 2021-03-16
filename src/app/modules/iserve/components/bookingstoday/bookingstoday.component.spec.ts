import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingstodayComponent } from './bookingstoday.component';

describe('BookingstodayComponent', () => {
  let component: BookingstodayComponent;
  let fixture: ComponentFixture<BookingstodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingstodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingstodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

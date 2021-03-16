import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardWidgetComponent } from './board-widget.component';

describe('BoardWidgetComponent', () => {
  let component: BoardWidgetComponent;
  let fixture: ComponentFixture<BoardWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

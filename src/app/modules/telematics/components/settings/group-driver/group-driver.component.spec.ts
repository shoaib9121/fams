import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDriverComponent } from './group-driver.component';

describe('GroupDriverComponent', () => {
  let component: GroupDriverComponent;
  let fixture: ComponentFixture<GroupDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

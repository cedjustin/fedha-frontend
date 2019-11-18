import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashPostComponent } from './dash-post.component';

describe('DashPostComponent', () => {
  let component: DashPostComponent;
  let fixture: ComponentFixture<DashPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

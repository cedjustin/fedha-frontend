import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashBlogComponent } from './dash-blog.component';

describe('DashBlogComponent', () => {
  let component: DashBlogComponent;
  let fixture: ComponentFixture<DashBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

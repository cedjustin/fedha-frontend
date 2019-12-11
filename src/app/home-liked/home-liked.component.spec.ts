import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLikedComponent } from './home-liked.component';

describe('HomeLikedComponent', () => {
  let component: HomeLikedComponent;
  let fixture: ComponentFixture<HomeLikedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLikedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLikedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnDiscountComponent } from './on-discount.component';

describe('OnDiscountComponent', () => {
  let component: OnDiscountComponent;
  let fixture: ComponentFixture<OnDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

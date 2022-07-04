import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersoaneModalComponent } from './persoane-modal.component';

describe('PersoaneModalComponent', () => {
  let component: PersoaneModalComponent;
  let fixture: ComponentFixture<PersoaneModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersoaneModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersoaneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

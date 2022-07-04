import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersoaneComponent } from './persoane.component';

describe('PersoaneComponent', () => {
  let component: PersoaneComponent;
  let fixture: ComponentFixture<PersoaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersoaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersoaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

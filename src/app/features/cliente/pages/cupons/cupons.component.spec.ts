import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuponsComponent } from './cupons.component';

describe('CuponsComponent', () => {
  let component: CuponsComponent;
  let fixture: ComponentFixture<CuponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

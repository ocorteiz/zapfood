import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InativaComponent } from './inativa.component';

describe('InativaComponent', () => {
  let component: InativaComponent;
  let fixture: ComponentFixture<InativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

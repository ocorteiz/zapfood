import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAdicionalComponent } from './form-adicional.component';

describe('FormAdicionalComponent', () => {
  let component: FormAdicionalComponent;
  let fixture: ComponentFixture<FormAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAdicionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

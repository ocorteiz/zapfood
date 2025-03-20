import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoriaAdicionalComponent } from './form-categoria-adicional.component';

describe('FormCategoriaAdicionalComponent', () => {
  let component: FormCategoriaAdicionalComponent;
  let fixture: ComponentFixture<FormCategoriaAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategoriaAdicionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCategoriaAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

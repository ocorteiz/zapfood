import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoriaEspecificacaoComponent } from './form-categoria-especificacao.component';

describe('FormCategoriaEspecificacaoComponent', () => {
  let component: FormCategoriaEspecificacaoComponent;
  let fixture: ComponentFixture<FormCategoriaEspecificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategoriaEspecificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCategoriaEspecificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

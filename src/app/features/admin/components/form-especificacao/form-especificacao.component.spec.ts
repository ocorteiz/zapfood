import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEspecificacaoComponent } from './form-especificacao.component';

describe('FormEspecificacaoComponent', () => {
  let component: FormEspecificacaoComponent;
  let fixture: ComponentFixture<FormEspecificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEspecificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEspecificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

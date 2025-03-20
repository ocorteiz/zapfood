import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCategoriaProdutoComponent } from './form-categoria-produto.component';

describe('FormCategoriaComponent', () => {
  let component: FormCategoriaProdutoComponent;
  let fixture: ComponentFixture<FormCategoriaProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCategoriaProdutoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCategoriaProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

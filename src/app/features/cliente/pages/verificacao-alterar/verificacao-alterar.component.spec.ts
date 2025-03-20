import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacaoAlterarComponent } from './verificacao-alterar.component';

describe('RegisterComponent', () => {
  let component: VerificacaoAlterarComponent;
  let fixture: ComponentFixture<VerificacaoAlterarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacaoAlterarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacaoAlterarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

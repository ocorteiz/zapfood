import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerEspecificacaoComponent } from './container-especificacao.component';

describe('ContainerEspecificacaoComponent', () => {
  let component: ContainerEspecificacaoComponent;
  let fixture: ComponentFixture<ContainerEspecificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerEspecificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerEspecificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

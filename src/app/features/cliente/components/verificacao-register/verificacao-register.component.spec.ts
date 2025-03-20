import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacaoRegisterComponent } from './verificacao-register.component';

describe('RegisterComponent', () => {
  let component: VerificacaoRegisterComponent;
  let fixture: ComponentFixture<VerificacaoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificacaoRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificacaoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

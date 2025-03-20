import { CommonModule, } from '@angular/common';
import { Component, inject, OnInit,  signal, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { AuthService } from '../../../../core/services/auth/auth.service';
import {  ICodigoValidar } from '../../../../core/interfaces/IAuh.interface';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.scss'
})
export class RecuperarComponent implements OnInit {

  #lojaService = inject(LojaService);
  #authService = inject(AuthService);

  #router = inject(Router)

  private fb = inject(FormBuilder);
  novaSenhaForm: FormGroup;

  erro: string = '';
  message: string = '';

  credenciais: { codigo: number | null, telefone: string | null } = {
    codigo: null,
    telefone: null
  }

  constructor() {
    this.novaSenhaForm = this.fb.group({
      codigo: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required]],
      confirmarSenha: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.showLoja()

    if (typeof window !== 'undefined' && window.history) {
      const navigation = history.state;
      this.credenciais = {
        codigo: navigation.codigo,
        telefone: navigation.telefone
      }
    }
    console.log(this.credenciais)
  }

  getImageUrl(caminhoImagem: string): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  public getLoja = signal<ILoja | null>(null);

  showLoja(): void {
    this.#lojaService.httpFind$().subscribe({
      next: (data) => {
        this.getLoja.set(data)
      },
      error: (error) => console.log("erro: ", error.error.message)
    })
  }

  onSubmit(): void {
    this.erro = ''

    const validation = [
      { isValid: () => this.novaSenhaForm.get('codigo')?.value !== null, message: 'CODIGO É OBRIGATÓRIO' },
      { isValid: () => this.novaSenhaForm.get('senha')?.value !== null, message: 'SENHA É OBRIGATÓRIO' },
      {
        isValid: () => this.novaSenhaForm.get('senha')?.value === this.novaSenhaForm.get('confirmarSenha')?.value,
        message: 'AS SENHAS NÃO COINCIDEM'
      },
    ]

    const invalidField = validation.find(validation => !validation.isValid())

    if (invalidField) {
      this.erro = invalidField.message
      return
    }

    if (this.credenciais.codigo != this.novaSenhaForm.get('codigo')?.value) {
      this.erro = "CODIGO INVALIDO"
    }

    const body: ICodigoValidar = {
      codigoGerado: this.credenciais.codigo,
      codigoEscrito: this.novaSenhaForm.get('codigo')?.value,
      password: this.novaSenhaForm.get('senha')?.value
    }

    this.updateSenha(this.credenciais.telefone, body);
  }

  updateSenha(telefone: string | null, body: ICodigoValidar): void {
    this.#authService.httpUpdateSenha$(telefone, body).subscribe({
      next: () => {
        this.erro = ""

        this.message = "SENHA REDEFINIDA. DIRECIONANDO PARA PAGINA DE LOGIN"

        setTimeout(() => {
          this.#router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        this.erro = error.error?.message
      }
    })
  }


}

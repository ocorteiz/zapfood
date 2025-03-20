import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILojaCredenciais } from '../../../../core/interfaces/ILoja.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  #router = inject(Router);
  #lojaService = inject(LojaService);
  private fb = inject(FormBuilder);
  credenciaisForm: FormGroup

  erro: string = '';

  constructor() {
    this.credenciaisForm = this.fb.group({
       email: [null, [Validators.required, Validators.email]],
       senha: [null, [Validators.required]],
       confirmarSenha: [null, [Validators.required]],
    })
  }

  onSubmit(): void {
    this.erro = ''

    const validations = [
      { isValid: () => this.credenciaisForm.get('email')?.value !== null, message: 'EMAIL É ORBRIGATÓRIO' },
      { isValid: () => this.credenciaisForm.get('senha')?.value !== null, message: 'SENHA É ORBRIGATÓRIO' },
      {
        isValid: () => this.credenciaisForm.get('senha')?.value === this.credenciaisForm.get('confirmarSenha')?.value,
        message: 'AS SENHAS NÃO COINCIDEM'
      },
    ];

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const body: ILojaCredenciais = {
      email: this.credenciaisForm.get('email')?.value,
      senha: this.credenciaisForm.get('senha')?.value
    }

    this.login(body)

    this.credenciaisForm.reset()

  }

  login(body: ILojaCredenciais): void {
    this.#lojaService.httpLogin$(body).subscribe({
      next: (data) => {
        const usuario = { id: data.id, nome: data.nome, email: body.email, tipo: 'ADMIN' }
        const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const token = data.token

        if (localStorage.getItem("data")) {
          localStorage.removeItem("data");
        }

        if (localStorage.getItem("usuario")) {
          localStorage.removeItem("usuario");
        }

        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }

        localStorage.setItem("usuario", JSON.stringify(usuario))
        localStorage.setItem("data", JSON.stringify(expirationTime))
        localStorage.setItem("token", JSON.stringify(token))

        this.#router.navigate(['/admin/loja'])
      },
      error: (error) => {
        this.erro = error.error?.message
      }
    })
  }

}

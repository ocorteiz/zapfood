import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IRegister } from '../../../../core/interfaces/IAuh.interface';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  #lojaService = inject(LojaService)
  #authService = inject(AuthService);
  #router = inject(Router);
  #slugService = inject(SlugService);

  dynamicParam: string = '';

  usuario: IRegister = {
    nome: '',
    telefone: '',
    password: '',
    confirmePassowrd: ''
  }

  erro: string = '';

  ngOnInit(): void {
    this.dynamicParam = this.#slugService.getParam();
    this.showLoja()
  }

  getImageUrl(caminhoImagem: string): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (value.length > 11) {
      value = value.slice(0, 11); // Limita ao máximo de 11 dígitos
    }

    // Aplica a máscara no formato (xx) x xxxx-xxxx
    const formattedValue = value.replace(
      /(\d{2})(\d{1})(\d{4})(\d{0,4})/,
      '($1) $2 $3-$4'
    );

    input.value = formattedValue.trim(); // Atualiza o campo de input
    this.usuario.telefone = formattedValue.trim(); // Atualiza o modelo
  }

  onSubmit(): void {
    this.erro = '';

    if (!this.usuario?.nome || !this.usuario.telefone || !this.usuario.password) {
      this.erro = "Preencha todos os campos"
      return;
    }

    if (this.usuario.telefone.replace(/\D/g, '').length !== 11) {
      this.erro = "Informe um numero de telefone valido"
      return
    }

    if (!this.validarSenha(this.usuario.password)) {
      this.erro = 'A senha deve conter ao menos 8 caracteres, incluindo letras e números';
      return;
    }

    if (this.usuario.password != this.usuario.confirmePassowrd) {
      this.erro = 'Senhas diferentes';
      return;
    }

    const body = {
      nome: this.usuario.nome,
      telefone: `55${this.usuario.telefone.replace(/\D/g, '')}`,
      password: this.usuario.password,
      confirmePassowrd: this.usuario.confirmePassowrd
    }

    this.registerCliente(body)
  }

  validarSenha(senha: string): boolean {
    const temLetra = /[a-zA-Z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const tamanhoSuficiente = senha.length >= 8;

    return temLetra && temNumero && tamanhoSuficiente;
  }

  // REGISTER CLIENTE

  credenciais: { codigo: number | null, nome: string | null, telefone: string | null, password: string | null } = {
    codigo: null,
    nome: null,
    telefone: null,
    password: null,
  }

  registerCliente(body: IRegister): void {
    this.#authService.httpRegisterCliente$(body).subscribe({
      next: (data) => {

        this.credenciais = {
          codigo: data.codigo,
          nome: body.nome,
          telefone: body.telefone,
          password: body.password
        }

        this.#router.navigate(['/verificacao-register'], {
          state: this.credenciais
        });

      },
      error: (error) => {
        this.erro = error.error?.message
      }
    })
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
}

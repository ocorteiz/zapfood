import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ILogin, IRegister } from '../../../../core/interfaces/IAuh.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  #lojaService = inject(LojaService)
  #authService = inject(AuthService);
  #router = inject(Router);
  #slugService = inject(SlugService);

  dynamicParam: string = '';

  usuario: ILogin = {
    telefone: '',
    password: ''
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
    let value = input.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    const formattedValue = value.replace(
      /(\d{2})(\d{1})(\d{4})(\d{0,4})/,
      '($1) $2 $3-$4'
    );

    input.value = formattedValue.trim();
    this.usuario.telefone = formattedValue.trim();
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

  login(body: ILogin): void {
    this.#authService.httpLogin$(body).subscribe({
      next: (data) => {
        console.log(data)
        const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
        const usuario = { id: data.id, nome: data.nome, telefone: body.telefone, tipo: 'USER' }
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

        localStorage.setItem("data", JSON.stringify(expirationTime))
        localStorage.setItem("usuario", JSON.stringify(usuario))
        localStorage.setItem("token", JSON.stringify(token))

        this.#router.navigate(['/', this.#slugService.getParam()])
      },
      error: (error) => {
        this.erro = error.error?.message
      }
    })
  }

  onSubmitLogin(): void {
    this.erro = '';

    if (!this.usuario.telefone || !this.usuario.password) {
      this.erro = "Preencha todos os campos"
      return;
    }

    if (this.usuario.telefone.replace(/\D/g, '').length !== 11) {
      this.erro = "Informe um numero de telefone valido"
      return
    }

    const body = {
      telefone: `55${this.usuario.telefone.replace(/\D/g, '')}`,
      password: this.usuario.password
    }

    this.login(body)
  }

  // RECUPERAR SENHA

  credenciais: { codigo: number | null, telefone: string | null } = {
    codigo: null,
    telefone: null
  }

  recuperarSenha(body: ILogin): void {
    this.#authService.httpRecuperarSenha$(body).subscribe({
      next: (data) => {

          this.credenciais = {
            codigo: data.codigo,
            telefone: body.telefone
          }

          this.#router.navigate(['/recuperar'], {
            state: this.credenciais
          });

      },
      error: (error) => {
        this.erro = error.error?.message
      }
    })
  }

  onSubmitSenha(): void {
    this.erro = '';

    if (!this.usuario.telefone) {
      this.erro = "informe seu telefone"
      return;
    }

    if (this.usuario.telefone.replace(/\D/g, '').length !== 11) {
      this.erro = "Informe um numero de telefone valido"
      return
    }

    const body: ILogin = {
      telefone: `55${this.usuario.telefone.replace(/\D/g, '')}`,
      password: this.usuario.password
    }

    this.recuperarSenha(body)
  }


}

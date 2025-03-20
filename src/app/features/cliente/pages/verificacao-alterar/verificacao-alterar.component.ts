import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ICodigoRequest, ILogin, IUsuarioValidar } from '../../../../core/interfaces/IAuh.interface';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";


@Component({
  selector: 'app-verificacao',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './verificacao-alterar.component.html',
  styleUrl: './verificacao-alterar.component.scss'
})
export class VerificacaoAlterarComponent implements OnInit {

  #lojaService = inject(LojaService);
  #authService = inject(AuthService);
  #notificacaoService = inject(NotificacaoService);
  #router = inject(Router);

  private fb = inject(FormBuilder);
  validarCodigoForm: FormGroup;

  erro: string = '';

  credenciais: { codigo: number | null, nome: string | null, telefone: string | null } = {
    codigo: null,
    nome: null,
    telefone: null
  }

  usuario = {
    id: 0,
    nome: '',
    telefone: ''
  };

  constructor() {
    this.validarCodigoForm = this.fb.group({
      codigoEscrito: [null, Validators.required]
    })
  }

  ngOnInit(): void {

    if (typeof window !== 'undefined' && window.history) {
      const navigation = history.state;
      this.credenciais = {
        codigo: navigation.codigo,
        nome: navigation.nome,
        telefone: navigation.telefone
      }
    }

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
      }
    }

    console.log(this.credenciais)

  }

  onSubmit(): void {
    this.erro = ''

    const validation = [
      { isvalid: () => this.validarCodigoForm.get('codigoEscrito')?.value !== null, message: 'CODIGO É OBRIGATÓRIO' }
    ]

    const invalidField = validation.find(validation => !validation.isvalid())

    if (invalidField) {
      this.erro = invalidField.message
      return
    }

    if (this.credenciais.codigo != this.validarCodigoForm.get('codigoEscrito')?.value) {
      this.erro = "CODIGO INVALIDO"
      return
    }

    const body: IUsuarioValidar = {
      id: this.usuario.id,
      nome: this.credenciais.nome,
      telefone: this.credenciais.telefone,
      codigoGerado: this.credenciais.codigo,
      codigoEscrito: this.validarCodigoForm.get('codigoEscrito')?.value
    }

    this.validarCodigo(body);
  }

  validarCodigo(body: IUsuarioValidar): void {
    this.#authService.httpValidarTelefone$(body).subscribe({
      next: (data) => {
        console.log(data)

        if (data === true) {


          if (localStorage.getItem("data")) {
            localStorage.removeItem("data");
          }

          if (localStorage.getItem("usuario")) {
            localStorage.removeItem("usuario");
          }

          if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
          }

          this.#router.navigate(['/login'])
        } else {
          this.erro = "CODIGO INVALIDO"
        }
      },
      error: (error) => {
        console.log('erro: ', console.log(error.error.message))
      }
    })
  }

}

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ICodigoRequest, ILogin, IUsuarioValidar } from '../../../../core/interfaces/IAuh.interface';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';


@Component({
  selector: 'app-verificacao',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './verificacao-register.component.html',
  styleUrl: './verificacao-register.component.scss'
})
export class VerificacaoRegisterComponent implements OnInit {

  #lojaService = inject(LojaService);
  #authService = inject(AuthService);
  #notificacaoService = inject(NotificacaoService);
  #router = inject(Router);

  private fb = inject(FormBuilder);
  validarCodigoForm: FormGroup;

  erro: string = '';

  credenciais: { codigo: number | null, nome: string | null, telefone: string | null, password: string | null } = {
    codigo: null,
    nome: null,
    telefone: null,
    password: null,
  }

  contador: number = 30;
  temporizadorAtivo: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.validarCodigoForm = this.fb.group({
      codigoEscrito: [null, Validators.required]
    })
  }

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)) {
      this.iniciarTemporizador();
    }

    this.showLoja()

    if (typeof window !== 'undefined' && window.history) {
      const navigation = history.state;
      this.credenciais = {
        codigo: navigation.codigo,
        nome: navigation.nome,
        telefone: navigation.telefone,
        password: navigation.password
      }
    }
  }

  iniciarTemporizador(): void {
    const intervalo = setInterval(() => {
      if (this.contador > 0) {
        this.contador--;
      } else {
        this.temporizadorAtivo = false;
        clearInterval(intervalo);
      }
    }, 1000);
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
      {isvalid: () => this.validarCodigoForm.get('codigoEscrito')?.value !== null, message: 'CODIGO É OBRIGATÓRIO'}
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
      nome: this.credenciais.nome,
      telefone: this.credenciais.telefone,
      password: this.credenciais.password,
      codigoGerado: this.credenciais.codigo,
      codigoEscrito: this.validarCodigoForm.get('codigoEscrito')?.value
    }

    this.validarCodigo(body)
  }

  validarCodigo(body: IUsuarioValidar): void {
    this.#authService.httpValidarUsuario$(body).subscribe({
      next: (data) => {
        if (data === true) {
          const bodyLogin: ILogin = {
            telefone: this.credenciais.telefone,
            password: this.credenciais.password
          }

          this.login(bodyLogin)

          this.#router.navigate(['/'])
        } else {
          this.erro = "CODIGO INVALIDO"
        }
      },
      error: (error) => {
        console.log('erro: ', console.log(error.error.message))
      }
    })
  }

  login(body: ILogin): void {
    this.#authService.httpLogin$(body).subscribe({
      next: (data) => {
        const usuario = { id: data.id, nome: data.nome, telefone: body.telefone, tipo: 'USER' }
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

        this.#router.navigate(['/'])
      },
      error: (error) => {
        this.erro = error.error?.message
      }
    })
  }

  enviarCodigo(event: Event): void {
    if (this.contador > 0) {
      event.preventDefault();
      return;
    }

    const body: ICodigoRequest = {
      telefone: this.credenciais.telefone
    }

    this.#notificacaoService.httpEnviarCodigo$(body).subscribe({
      next: (data) => {
        console.log(data)
        this.credenciais.codigo = data.codigo
      },
      error: (error) => {
        this.erro = error.error?.message
      },
      complete: () => {
        console.log(this.credenciais)
      }
    })
  }


}

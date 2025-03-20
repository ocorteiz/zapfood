import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnInit, PLATFORM_ID, signal, } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ICodigoRequest, ILogin, IUpdateUsuario, IUsuarioValidar } from '../../../../core/interfaces/IAuh.interface';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-alterar-infos',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './alterar.component.html',
  styleUrl: './alterar.component.scss'
})
export class AlterarComponent {

  dynamicParam: string = '';

  #authService = inject(AuthService);
  #router = inject(Router);
  #slugService = inject(SlugService);
  #lojaService = inject(LojaService);

  private fb = inject(FormBuilder);
  infoUsuarioForm: FormGroup;

  erro: string = '';

  messageSucess: string | null = null;
  messageErro: string | null = null;

  usuario = {
    id: 0,
    nome: '',
    telefone: ''
  };

  constructor() {
    this.infoUsuarioForm = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required]
    })
  }

  #activatedRouter = inject(ActivatedRoute);

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    this.dynamicParam = this.#slugService.getParam();

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
      }
    }
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

    this.infoUsuarioForm.get('telefone')?.setValue(formattedValue, { emitEvent: false })
  }

  onSubmit(): void {
    this.erro = ''

    if (this.infoUsuarioForm.get('nome')?.value === '' && this.infoUsuarioForm.get('telefone')?.value === '') {
        this.erro = "PREENCHA AS INFORMAÇÔES PARA PODER ALTERAR"
        return
    }

    if (this.infoUsuarioForm.get('telefone')?.value != '') {
      if (this.infoUsuarioForm.get('telefone')?.value.replace(/\D/g, '').length !== 11) {
        this.erro = "Informe um numero de telefone valido"
        return
      }
    }

    const body: IUpdateUsuario = {
      nome: this.infoUsuarioForm.get('nome')?.value != '' ? this.infoUsuarioForm.get('nome')?.value : null,
      telefone: this.infoUsuarioForm.get('telefone')?.value != '' ? `55${this.infoUsuarioForm.get('telefone')?.value.replace(/\D/g, '')}` : this.usuario.telefone
    }

    this.alterarInfos(body)

  }

  credenciais: { codigo: number | null, nome: string | null, telefone: string | null} = {
    codigo: null,
    nome: null,
    telefone: null,
  }

  alterarInfos(body: IUpdateUsuario): void {
    this.#authService.httpUpdateCliente$(body).subscribe({
      next: (data) => {
        console.log(data)

        this.credenciais = {
          codigo: data.codigo,
          nome: body.nome,
          telefone: body.telefone
        }

        this.#router.navigate(['/verificacao-alterar'], {
          state: this.credenciais
        });

      },
      error: (error) => {
        this.erro = error.error?.message
      }
    })
  }

  public getLoja = signal<ILoja | null>(null);

  findByNomeLoja(slug: string): void {
    this.#lojaService.httpFindByNome$(slug).subscribe({
      next: (data) => {
        this.getLoja.set(data)
      },
      error: (error) => {
        console.log("erro: ", error.error.message)
        this.#router.navigate(['/loja/inativa']);
      }
    })
  }

}

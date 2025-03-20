import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';
import { IConectarInstancia, ICreateNotificacao, IResponseConectarInstancia } from '../../../../core/interfaces/INotificacao.interface';

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notificacao.component.html',
  styleUrl: './notificacao.component.scss'
})
export class NotificacaoComponent {

  #notificacaoService = inject(NotificacaoService);

  private fb = inject(FormBuilder);
  notificacaoForm: FormGroup;

  erro = ''

  messageSucess: string | null = null;
  messageError: string | null = null;

  pagina: string | null = 'NOTIFICAÇÃO';
  senha: boolean = false;

  isLoading = false;

  constructor() {
    this.notificacaoForm = this.fb.group({
      titulo: [null, Validators.required],
      paragrafo_1: [null, Validators.required],
      paragrafo_2: [null, Validators.required],
    });
  }

  getImageUrl(caminhoImagem: string | undefined): string {
    return `${caminhoImagem}`;
  }

  selectStatus(newStatus: string, event: Event): void {
    this.pagina = newStatus;

    const headers = document.querySelectorAll('.item-status');
    headers.forEach(h => h.classList.remove('active'));

    const clickedElement = event.target as HTMLElement;
    clickedElement.classList.add('active');
  }

  // FORM NOTIFICAÇÃO

  notificacao(notificacao: ICreateNotificacao): void {
    this.#notificacaoService.httpNotificacao$(notificacao).subscribe({
      next: () => {
        this.messageSucess = "NOTIFICAÇÃO ENVIADA COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null
        }, 3000)
      },
      error: (error) => {
        this.messageError = error.error.message

        setTimeout(() => {
          this.messageError = null
        }, 3000)
      }
    })
  }

  onSubmitNotificacao(): void {
    this.erro = ''

    const validations = [
      { isValid: () => this.notificacaoForm.get('titulo')?.value !== null, message: 'Titulo é obrigatorio' },
      { isValid: () => this.notificacaoForm.get('paragrafo_1')?.value !== null, message: '1º Paragrafo é obrigatório' }
    ];

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const notificacao: ICreateNotificacao = this.notificacaoForm.value

    this.notificacao(notificacao);

    this.notificacaoForm.reset()
  }

  public getBase64 = signal<IResponseConectarInstancia | null>(null);

  conectarInstancia(): void {
    this.isLoading = true

    this.#notificacaoService.httpConectarInstancia$('lcburguer').subscribe({
      next: (data) => {
        console.log(data)
        this.getBase64.set(data)
      },
      error: (error) => {
        this.messageError = error.error.message

        setTimeout(() => {
          this.messageError = null
        }, 3000)
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }


}

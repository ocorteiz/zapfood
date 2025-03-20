import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { IPagamento } from '../../../../core/interfaces/IPagamento.interface';
import { CommonModule } from '@angular/common';
import { FormPagamentoComponent } from "../../components/form-pagamento/form-pagamento.component";
import { PagamentoService } from '../../../../core/services/pagamento/pagamento.service';
import { error } from 'console';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { IToken, ITokenMP } from '../../../../core/interfaces/IToken.interface';
import { TokenService } from '../../../../core/services/token/token.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pagamentos',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormPagamentoComponent, ReactiveFormsModule],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.scss'
})
export class PagamentosComponent implements OnInit {

  #pagamentoService = inject(PagamentoService);
  #tokenService = inject(TokenService);

  showAddPagamento = false;
  showDelete = false;

  messageSucess: string | null = null;
  messageError: string | null = null;

  pagina: string | null = 'PAGAMENTOS';
  erro = ''

  private fb = inject(FormBuilder);
  MPTokensForm: FormGroup;

  constructor() {
    this.MPTokensForm = this.fb.group({
      mPToken: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.findAllPagamentos()
    this.findByToken()
    this.findPagamentoViaPix()
  }

  receberMessagem(message: string | null) {
    this.messageSucess = message;

    setTimeout(() => {
      this.messageSucess = null;
    }, 2000);
  }

  toggleAddPagamento() {
    this.findAllPagamentos()
    this.showAddPagamento = !this.showAddPagamento
  }

  toggleDelete() {
    this.showDelete = !this.showDelete
  }

  selectStatus(newStatus: string, event: Event): void {
    this.pagina = newStatus;

    const headers = document.querySelectorAll('.item-status');
    headers.forEach(h => h.classList.remove('active'));

    const clickedElement = event.target as HTMLElement;
    clickedElement.classList.add('active');
  }

  // FIND ALL PAGAMENTOS

  public getPagamentos = signal<IPagamento[] | []>([])

  findAllPagamentos(): void {
    this.#pagamentoService.httpFindAllPagamentos$().subscribe({
      next: (data) => this.getPagamentos.set(data),
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // FIND PAGAMENTO VIA PIX

  public getPagamento = signal<IPagamento | null>(null)

  findPagamentoViaPix(): void {
    this.#pagamentoService.httpFindPagamentoViaPix$().subscribe({
      next: (data) => {
        this.getPagamento.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // DESATIVAR PAGAMENTO

  desativarPagamento(idPagamento: number): void {
    this.#pagamentoService.httpDesativarPagamento$(idPagamento).subscribe({
      next: () => {
        this.findAllPagamentos()

        this.messageSucess = "MÉTODO DE PAGAMENTO DESATIVADA COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // ATIVAR PAGAMENTO

  ativarPagamento(idPagamento: number): void {
    this.#pagamentoService.httpAtivarPagamento$(idPagamento).subscribe({
      next: () => {
        this.findAllPagamentos()

        this.messageSucess = "MÉTODO DE PAGAMENTO ATIVADA COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // DELETAR PAGAMENTO

  deletarPagamento(idPagamento: number): void {
    this.#pagamentoService.httpDeletarPagamento$(idPagamento).subscribe({
      next: () => {
        this.toggleDelete()
        this.findPagamentoViaPix()
        this.findAllPagamentos()

        this.messageSucess = "MÉTODO DE PAGAMENTO DELETADO COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.messageError = error.error.message;

          setTimeout(() => {
            this.messageError = null;
          }, 2000);
        } else {
          console.log("Erro desconhecido:", error);
        }
      }
    })
  }

  // DESATIVAR PAGAMENTO VIA PIX

  desativarPagamentoViaPix(): void {
    this.#pagamentoService.httpDesativarPagamentoViaPix$().subscribe({
      next: () => {
        this.findPagamentoViaPix()
        this.findAllPagamentos()

        this.messageSucess = "MÉTODO DE PAGAMENTO DESATIVADA COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // ATIVAR PAGAMENTO VIA PIX

  ativarPagamentoViaPix(): void {
    this.#pagamentoService.httpAtivarPagamentoViaPix$().subscribe({
      next: () => {
        this.findPagamentoViaPix()
        this.findAllPagamentos()

        this.messageSucess = "MÉTODO DE PAGAMENTO ATIVADA COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET TOKENS

  public getTokens = signal<IToken | null>(null);

  findByToken(): void {
    this.#tokenService.httpFindByIdToken$().subscribe({
      next: (data) => {
        this.getTokens.set(data)

        this.MPTokensForm.setValue({
          mPToken: data.mPToken,
        });
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  // FORM TOKEN

  updateMPToken(body: ITokenMP): void {
    this.#tokenService.httpUpdateMPTokens$(body).subscribe({
      next: () => {
        this.findByToken()
        this.messageSucess = "TOKEN ATUALIZADOS COM SUCESSO"

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

  onSubmitToken(): void {
    this.erro = ''

    const validations = [
      { isValid: () => this.MPTokensForm.get('mPToken')?.value !== '', message: 'AUTH TOKEN É ORBRIGATÓRIO' },
    ];

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    this.updateMPToken(this.MPTokensForm.value);

    this.MPTokensForm.reset()
  }


}

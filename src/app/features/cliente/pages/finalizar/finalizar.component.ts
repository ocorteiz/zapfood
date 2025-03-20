import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormEnderecoComponent } from "../../components/form-endereco/form-endereco.component";
import { FormCuponsComponent } from "../../components/form-cupons/form-cupons.component";
import { IEndereco } from '../../../../core/interfaces/IEndereco.interface';
import { EnderecoService } from '../../../../core/services/endereco/endereco.service';
import { IPagamento } from '../../../../core/interfaces/IPagamento.interface';
import { PagamentoService } from '../../../../core/services/pagamento/pagamento.service';
import { FormsModule, NgModel } from '@angular/forms';
import { ICupom } from '../../../../core/interfaces/ICupom.interface';
import { ICreatePedido, IResumoPedido } from '../../../../core/interfaces/IPedido.interface';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { CardCupomComponent } from "../../components/card-cupom/card-cupom.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SlugService } from '../../../../core/resolver/slug.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';

@Component({
  selector: 'app-finalizar',
  standalone: true,
  imports: [HeaderComponent, RouterLink, FooterComponent, CommonModule, FormEnderecoComponent, FormCuponsComponent, FormsModule],
  templateUrl: './finalizar.component.html',
  styleUrl: './finalizar.component.scss'
})
export class FinalizarComponent implements OnInit {

  showAddAddress = false;
  showAddCupom = false;

  dynamicParam: string = '';

  #enderecoService = inject(EnderecoService);
  #pagamentoService = inject(PagamentoService);
  #pedidoService = inject(PedidoService);
  #slugService = inject(SlugService);
  #lojaService = inject(LojaService);

  #router = inject(Router);

  usuario = {
    id: 0,
    nome: '',
  }

  isLoading = false;

  #activatedRouter = inject(ActivatedRoute);

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    this.dynamicParam = this.#slugService.getParam();

    this.findByAtivosPagamento()

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
        this.findEnderecosByCliente(this.usuario.id)
      }
    }

    if (typeof window !== 'undefined' && window.history) {
      const navigation = history.state;
      this.carrinho = {
        id: navigation.id,
        total: navigation.total
      }
    }
  }

  toggleAddAddress() {
    this.showAddAddress = !this.showAddAddress;

    const section = document.getElementsByTagName('main')[0];
    section?.classList.toggle("active")
  }

  toggleAddCupom() {
    this.showAddCupom = !this.showAddCupom;

    const section = document.getElementsByTagName('main')[0];
    section?.classList.toggle("active")
  }

  calcularTotal(subtotal: number | null): number {
    const valorSubtotal = subtotal ?? 0;
    const valorCupom = this.cupomSelecionado?.valor ?? 0
    const valorTaxaDeEntrega = this.endereco.taxaDeEntrega ?? 0

    return (valorSubtotal - valorCupom) + valorTaxaDeEntrega
  }

  // CARRINHO

  carrinho: { id: number; total: number } = {
    id: 0,
    total: 0
  }

  // ENDEREÇO

  onUpdateEnderecos() {
    this.findEnderecosByCliente(this.usuario.id);
  }

  public getEnderecos = signal<IEndereco[]>([])

  findEnderecosByCliente(idCliente: number): void {
    this.#enderecoService.httpFindEnderecosByCliente$(idCliente).subscribe({
      next: (data) => {
        this.getEnderecos.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }

  selectedAddress: number | null = null;

  endereco: { id: number | null; taxaDeEntrega: number | null } = {
    id: null,
    taxaDeEntrega: null
  }

  selectAddress(index: number): void {
    if (index === null || this.selectedAddress === index) {
      this.selectedAddress = null;
      this.endereco = { id: null, taxaDeEntrega: null };
    } else {
      this.selectedAddress = index;
      this.endereco = {
        id: this.getEnderecos()[index].id,
        taxaDeEntrega: this.getEnderecos()[index].taxaDeEntrega
      };
    }
  }

  // PAGAMENTO

  public getPagamentos = signal<IPagamento[]>([])

  findByAtivosPagamento(): void {
    this.#pagamentoService.httpFindByAtivosPagamentos$().subscribe({
      next: (data) => {
        this.getPagamentos.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }

  selectedPagamento: number | null = null;

  pagamento: { id: number | null } = {
    id: null
  }

  selectPagamento(index: number): void {
    if (index === null || this.selectedPagamento === index) {
      this.selectedPagamento = null;
      this.pagamento = { id: null };
    } else {
      this.selectedPagamento = index;
      this.pagamento = {
        id: this.getPagamentos()[index].id
      }
    }
  }

  // OBSERVAÇÃO

  observacao: string = '';

  // CUPOM

  cupomSelecionado: ICupom | null = null;

  onCupomSelecionado(cupom: ICupom): void {
    this.cupomSelecionado = cupom;
    if (this.carrinho.total < this.cupomSelecionado.valorParaPedido) {
      this.erro = "REGRAS DE CUPOM NÃO ALCANÇADAS"
      this.cupomSelecionado = null
    }
  }

  excluirCompum(): void {
    this.cupomSelecionado = null
  }

  //

  erro: string = ""

  submit(): void {
    this.erro = ""

    const pedido: ICreatePedido = {
      observacao: this.observacao,
      subtotal: this.carrinho.total,
      desconto: this.cupomSelecionado ? this.cupomSelecionado.valor : 0.0,
      taxaDeEntrega: this.endereco.taxaDeEntrega,
      total: this.calcularTotal(this.carrinho.total),
      idEndereco: this.endereco.id,
      idMetodoDePagamento: this.pagamento.id,
      idCupom: this.cupomSelecionado ? this.cupomSelecionado.id : null
    }

    if (!this.endereco.id || !this.pagamento.id) {
      this.erro = "PREENCHA OS CAMPOS NECESSÁRIOS"
      return
    }

    this.createPedido(this.carrinho.id, this.usuario.id, pedido)
  }


  createPedido(idCarrinho: number, idCliente: number, pedido: ICreatePedido): void {
    this.isLoading = true

    this.#pedidoService.httpCreatePedido$(idCarrinho, idCliente, pedido).subscribe({
      next: (data) => {
        if (data?.status == "AGUARDANDO PAGAMENTO") {
          this.#router.navigate(['/', this.dynamicParam, 'pagamento', data?.id])
        } else {
          this.#router.navigate(['/', this.dynamicParam , 'pedido', data?.id])
        }
      },
      error: (error) => {
        console.log("error: ", error)
      },
      complete: () => {
        this.isLoading = false
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

import { ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { IPedido } from '../../../../core/interfaces/IPedido.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';
import { SlugService } from '../../../../core/resolver/slug.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';

@Component({
  selector: 'app-pix',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './pagamento.component.html',
  styleUrl: './pagamento.component.scss'
})
export class PixComponent implements OnInit, OnDestroy {

  #id: string | null = null;

  #pedidoService = inject(PedidoService);
  #slugService = inject(SlugService);
  #lojaService = inject(LojaService);

  #activatedRouter = inject(ActivatedRoute);
  #router = inject(Router);

  messageSucess: string | null = null;
  messageError: string | null = null;

  usuario = {
    id: 0,
    nome: '',
  };

  messageCopy: string | null = null;
  notificacao: string | null = null;

  contador: number = 1800;
  temporizadorAtivo: boolean = true;
  intervalo: any;

  dynamicParam: string = '';

  constructor(
    private notificacaoService: NotificacaoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    this.dynamicParam = this.#slugService.getParam();

    if (isPlatformBrowser(this.platformId)) {
      this.verificarTemporizador();
    }

    this.#activatedRouter.paramMap.subscribe(paraMap => {
      this.#id = paraMap.get('id');
      if (this.#id) {
        this.findByIdPedido()
      }
    })

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)

        this.notificacaoService.connectPayment(this.usuario.id, (message) => {
          clearInterval(this.intervalo);
          this.temporizadorAtivo = false;

          localStorage.removeItem('tempo_inicio');

          this.notificacao = message
          this.cdr.detectChanges();

          if (message === "PAGAMENTO CONFIRMADO") {
            setTimeout(() => {
              if (this.dynamicParam) {
                this.#router.navigate(['/', this.dynamicParam, 'pedido', this.#id]);
              }
            }, 3000);
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.notificacaoService.disconnectPayment()
  }

  iniciarTemporizador(): void {
    this.intervalo = setInterval(() => {
      if (this.contador > 0) {
        this.contador--;
      } else {
        this.temporizadorAtivo = false;
        clearInterval(this.intervalo);
        localStorage.removeItem('tempo_inicio');
        this.deletarPedido(this.#id)
      }
    }, 1000);
  }

  verificarTemporizador(): void {
    const tempoSalvo = localStorage.getItem('tempo_inicio');
    const agora = Date.now();

    if (tempoSalvo) {
      const diferenca = Math.floor((agora - parseInt(tempoSalvo)) / 1000);
      this.contador = Math.max(1800 - diferenca, 0);

      if (this.contador > 0) {
        this.iniciarTemporizador();
      } else {
        this.temporizadorAtivo = false;
      }
    } else {
      localStorage.setItem('tempo_inicio', agora.toString());
      this.iniciarTemporizador();
    }
  }

  formatarTempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundosRestantes.toString().padStart(2, '0')}`;
  }

  getImageUrl(caminhoImagem: string): string {
    return `data:image/png;base64,${caminhoImagem}`;
  }

  copyToClipboard(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.messageCopy = 'CODIGO COPIADO PARA ARÉA DE TRANSFERENCIA';

      setTimeout(() => {
        this.messageCopy = ""
      }, 3000)
    }).catch((err) => {
      console.error('Erro ao copiar código: ', err);
    });
  }

  public getPedido = signal<null | IPedido>(null)

  findByIdPedido(): void {
    this.#pedidoService.httpFindByIdPedido$(this.#id).subscribe({
      next: (data) => {
        this.getPedido.set(data);

        if (this.getPedido()?.status == 'AGUARDANDO ACEITACAO') {
          localStorage.removeItem('tempo_inicio');
          this.#router.navigate(['/', this.dynamicParam, 'pedido', this.#id]);
        }

      },
      error: (error) => console.log("error: ", error.error.message)
    })
  }

  deletarPedido(idPedido: string | null): void {
    this.#pedidoService.httpDeletePedido$(this.#id).subscribe({
      next: () => {
        this.messageSucess = "TEMPO PARA PAGAMENTO ESGOTADO"

        setTimeout(() => {
          this.messageSucess = null
          this.#router.navigate(['/', this.dynamicParam, 'meus-pedidos']);
        }, 3000)
      },
      error: (error) => console.log("error: ", error.error.message)
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

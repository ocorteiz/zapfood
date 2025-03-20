import { Component, inject, Inject, LOCALE_ID, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
// import echarts core
import * as echarts from 'echarts/core';
// import necessary echarts components
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption } from 'echarts/types/dist/shared';
echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer, BarChart, GridComponent]);

declare var window: any;

import { DecimalPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';  // Importa a localidade pt-BR
import { RelatorioService } from '../../../../core/services/relatorio/relatorio.service';
import { IRelatorioPedidosPorBairro, IRelatorioPedidosPorPagamento, IRelatorioProdutosMais, IRelatorioProdutosNaoVendidos, IRelatorioResumoPedidos } from '../../../../core/interfaces/IRelatorio.interface';

// Registra a localidade pt-BR
registerLocaleData(localePt)

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NgxEchartsDirective, DecimalPipe],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.scss',
  providers: [
    provideEchartsCore({ echarts }),
    { provide: LOCALE_ID, useValue: 'pt-BR' },  // Configura a localidade
    DecimalPipe  // Registra o pipe DecimalPipe
  ]
})
export class RelatorioComponent implements OnInit {

  isBrowser: boolean = false;

  messageSucess: string | null = null;
  messageError: string | null = null;

  #relatorioService = inject(RelatorioService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.findResumoPedidos()
    this.findPedidosPorBairro()
    this.findPedidosPorPagamento()
    this.findProdutosMaisVendidos()
    this.findProdutosMenosVendidos()
    this.findProdutosNaoVendidos()

    if (this.isBrowser) {
      console.log('Executando no navegador');
    } else {
      console.log('Executando no servidor');
    }
  }

  // DATA RESUMO

  public getResumoPedidos = signal<{ name: string, value: number }[] | null>(null);

  findResumoPedidos(): void {
    this.#relatorioService.httpFindResumoPedidos$().subscribe({
      next: (data: IRelatorioResumoPedidos) => {
        // Transformando os dados recebidos em um array de { name, value }
        const resumoArray = Object.entries(data).map(([key, value]) => ({
          name: this.formatKeyName(key),
          value: value
        }));
        this.getResumoPedidos.set(resumoArray);
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  // DATA BAIRRO

  public getPedidosPorBairro = signal<IRelatorioPedidosPorBairro[] | []>([]);
  public pedidosPorBairro: EChartsOption = {};

  findPedidosPorBairro(): void {
    this.#relatorioService.httpFindPedidosPorBairro$().subscribe({
      next: (data) => {
        this.getPedidosPorBairro.set(data)
        this.pedidosPorBairro = this.getPedidosPorBairroOption();
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  getPedidosPorBairroOption(): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: this.getPedidosPorBairro().map(item => item.bairro.toUpperCase()),
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            rotate: 45,
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'QUANTIDADE',
          type: 'bar',
          barWidth: '60%',
          data: this.getPedidosPorBairro().map(item => item.total),
          itemStyle: {
            color: '#F29F05'
          }
        }
      ]
    };
  }

  // DATA METODO DE PAGAMENTO

  public getPedidosPorPagamento = signal<IRelatorioPedidosPorPagamento[] | []>([]);
  public pedidosPorPagamento: EChartsOption = {};

  findPedidosPorPagamento(): void {
    this.#relatorioService.httpFindPedidosPorPagamento$().subscribe({
      next: (data) => {
        this.getPedidosPorPagamento.set(data)
        this.pedidosPorPagamento = this.getPedidosPorPagamentoOption();
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  getPedidosPorPagamentoOption(): EChartsOption {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'top',
        left: 'center',
        textStyle: {
          align: 'center'
        }
      },
      series: [
        {
          name: 'QUANTIDADE',
          type: 'pie',
          radius: ['40%', '60%'],
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: this.getPedidosPorPagamento().map(item => ({
            value: item.total,
            name: item.metodo.toUpperCase()
          }))
        }
      ]
    };
  }

  // DATA PRODUTOS MAIS VENDIDOS

  public getProdutosMaisVendidos = signal<IRelatorioProdutosMais[] | []>([]);
  public produtosMaisVendidos: EChartsOption = {};

  findProdutosMaisVendidos(): void {
    this.#relatorioService.httpFindProdutosMaisVendidos$().subscribe({
      next: (data) => {
        this.getProdutosMaisVendidos.set(data)
        this.produtosMaisVendidos = this.getProdutosMaisVendidosOption();
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  getProdutosMaisVendidosOption(): EChartsOption {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'top',
        left: 'center',
        textStyle: {
          align: 'center'
        }
      },
      series: [
        {
          name: 'QUANTIDADE',
          type: 'pie',
          radius: ['40%', '60%'],
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: this.getProdutosMaisVendidos().map(item => ({
            value: item.total,
            name: item.nome.toUpperCase()
          }))
        }
      ]
    };
  }


  // DATA PRODUTOS MENOS VENDIDOS

  public getProdutosMenosVendidos = signal<IRelatorioProdutosMais[] | []>([]);
  public produtosMenosVendidos: EChartsOption = {};

  findProdutosMenosVendidos(): void {
    this.#relatorioService.httpFindProdutosMenosVendidos$().subscribe({
      next: (data) => {
        this.getProdutosMenosVendidos.set(data)
        this.produtosMenosVendidos = this.getProdutosMenosVendidosOption();
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  getProdutosMenosVendidosOption(): EChartsOption {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'top',
        left: 'center',
        textStyle: {
          align: 'center'
        }
      },
      series: [
        {
          name: 'QUANTIDADE',
          type: 'pie',
          radius: ['40%', '60%'],
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: this.getProdutosMenosVendidos().map(item => ({
            value: item.total,
            name: item.nome.toUpperCase()
          }))
        }
      ]
    };
  }

  // DATA PRODUTOS MENOS VENDIDOS

  public getProdutosNaoVendidos = signal<IRelatorioProdutosNaoVendidos[] | []>([]);

  findProdutosNaoVendidos(): void {
    this.#relatorioService.httpFindProdutosNaoVendidos$().subscribe({
      next: (data) => {
        this.getProdutosNaoVendidos.set(data)
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  //

  private formatKeyName(key: string): string {
    const formatted = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/(\d+)/g, ' $1 ')
    return formatted;
  }

}




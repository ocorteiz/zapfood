export interface IRelatorioResumoPedidos {
  receitaTotal: number;
  totalPedidos: number;
  ticketMedio: number;
  numeroDeClientes: number;
  receitaUltimos7Dias: number;
  totalPedidosUltimos7Dias: number;
  receitaUltimoDia: number;
  totalPedidosUltimoDia: number;
}

export interface IRelatorioPedidosPorBairro {
  bairro: string;
  total: number;
}

export interface IRelatorioPedidosPorPagamento {
  metodo: string;
  total: number;
}

export interface IRelatorioProdutosMais {
  nome: string;
  total: number;
}

export interface IRelatorioProdutosMenos {
  nome: string;
  total: number;
}

export interface IRelatorioProdutosNaoVendidos {
  nome: string;
}





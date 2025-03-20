export interface ICupom {
  id: number;
  nome: string;
  codigo: string;
  valor: number | 0;
  valorParaPedido: number;
  descricao: string;
  resgatavel: boolean;
  dataDeValidade: number;
  status: boolean
}

export interface ICupons {
  status: string,
  cupons: ICupom[] | []
}

export interface ICupomCreate {
  nome: string;
  valor: number | 0;
  descricao: string;
  valorParaPedido: number;
  resgatavel: boolean;
  dataDeValidade: number;
}


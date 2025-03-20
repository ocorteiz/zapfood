export interface IEndereco {
  id: number;
  bairro: string;
  rua: string;
  numero: number;
  complemento: string | null;
  taxaDeEntrega: number;
  tipoEndereco: string;
}

export interface IResumoEndereco {
  id?: number;
  bairro: string;
  rua: string;
  numero: number;
  complemento: string | null;
}

export interface IEnderecoCreate {
  idBairro: number | null | string;
  rua: string | null;
  numero: number | null;
  complemento: string | null;
}


export interface IBairro {
  id: number ;
  nome: string;
  taxaDeEntrega: number;
  status: boolean;
}

export interface IBairroCreate {
  nome: string;
  taxaDeEntrega: number;
}

export interface IBairroUpdate {
  taxaDeEntrega: number;
}



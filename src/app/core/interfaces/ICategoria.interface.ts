export interface ICreateCategoriaDeProduto {
  nome: string
}

export interface ICategoriaDeProduto {
  id: number;
  nome: string
}

export interface ICreateCategoriaDeAdicional {
  nome: string;
  maximoPorCategoria: number;
}

export interface ICategoriaDeAdicional {
  id: number;
  nome: string;
  maximoPorCategoria: number;
}

export interface ICreateCategoriaDeEspecificacao  {
  nome: string;
  minimoPorCategoria: number;
}

export interface ICategoriaDeEspecificacao  {
  id: number;
  nome: string;
  minimoPorCategoria: number;
}







import { ICategoriaDeAdicional } from "./ICategoria.interface";

export interface ICreateAdicional {
  nome: string;
  descricao: string;
  preco: number;
  idCategoria: number;
}

export interface ICreateAdicionalToItem {
  id: number;
  quantidade: number
}

export interface IUpdateAdicional {
  descricao: string;
  preco: number;
}

export interface IAdicional {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number
  categoria: ICategoriaDeAdicional,
  status: boolean
}

export interface IAdicionais {
  categoria: ICategoriaDeAdicional;
  adicionais: IAdicional[];
}

export interface IResumoAdicional {
  nome: string;
  preco: number;
  quantidade: number
}

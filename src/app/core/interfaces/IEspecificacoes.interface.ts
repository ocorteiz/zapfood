import { ICategoriaDeEspecificacao } from "./ICategoria.interface";

export interface ICreateEspecificacao {
  nome: string;
  descricao: string;
  idCategoria: number;
}

export interface ICreateEspecificacaoToItem {
  id: number;
}

export interface IUpdateEspecificacao {
  descricao: string;
}

export interface IEspecificacao {
  id: number;
  nome: string;
  descricao: string;
  categoria: ICategoriaDeEspecificacao,
  status: boolean;
  selecionado?: boolean;
}

export interface IEspecificacoes {
  categoria: ICategoriaDeEspecificacao;
  especificacoes: IEspecificacao[];
}

export interface IResumoEspecificacao {
  nome: string;
}

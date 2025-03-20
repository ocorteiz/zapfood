import { ICreateAdicionalToItem, IResumoAdicional } from "./IAdicionais.interface";
import { ICreateEspecificacaoToItem, IResumoEspecificacao } from "./IEspecificacoes.interface";

export interface IItem {
  id: number;
  nome: string;
  imagem: string;
  preco: number;
  quantidade: number;
  adicionais: IResumoAdicional[] | null;
  especificacoes: IResumoEspecificacao[] | null;
  observacao: string;
  total: number;
}

export interface IResumoItem {
  id: number;
  imagem?: string;
  nome: string;
  quantidade?: number;
  adicionais?: IResumoAdicional[] | null;
  especificacoes?: IResumoEspecificacao[] | null;
}

export interface IItemCreate {
  idProduto: number | null;
  quantidade: number;
  observacao: string;
  adicionais: ICreateAdicionalToItem[] | null;
  especificacoes: ICreateEspecificacaoToItem[] | null;
}




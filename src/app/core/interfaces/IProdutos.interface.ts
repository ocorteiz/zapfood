import { ICategoriaDeProduto } from "./ICategoria.interface";

export interface IProduto {
  id: number;
  imagem: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: ICategoriaDeProduto
  status: boolean
}

export interface IProdutos {
  categoria: ICategoriaDeProduto;
  produtos: IProduto[] | [];
}


export interface IProdutoCreate {
  nome: string;
  descricao: string;
  preco: number;
  idCategoria: number;
}

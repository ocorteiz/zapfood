import { IResumoCliente } from "./ICliente.interface";
import { ICupom } from "./ICupom.interface";
import { IResumoEndereco } from "./IEndereco.interface";
import { IItem, IResumoItem } from "./IItem.interface";

export interface ICreatePedido {
  observacao: string;
  subtotal: number;
  desconto: number;
  taxaDeEntrega: number | null;
  total: number;
  idEndereco: number | null;
  idMetodoDePagamento: number | null;
  idCupom: number | null;
}

export interface IPedido {
  id: number;
  cliente: IResumoCliente;
  dataDeCriacao: string;
  status: string;
  endereco: IResumoEndereco;
  metodoDePagamento: string;
  itens: IItem[];
  cupom?: ICupom;
  observacao?: string;
  subtotal: number;
  desconto: number;
  taxaDeEntrega: number;
  total: number;
  pixQRCode: string;
  pixCode: string;
}

export interface IResumoPedido {
  id: number;
  nomeCliente?: string;
  dataDeCriacao?: string;
  status?: string;
  itens: IResumoItem[];
  total?: number;
  endereco?: IResumoEndereco
}



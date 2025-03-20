import { IResumoEndereco } from "./IEndereco.interface"
import { IResumoItem } from "./IItem.interface";
import { IResumoPedido } from "./IPedido.interface"

export interface ICliente {
  id: number
  nome: string
  ultimoPedido: IResumoItem[] | null;
  ultimoEndereco: IResumoEndereco | null
}

export interface IResumoCliente {
  nome: string;
  telefone: string;
}



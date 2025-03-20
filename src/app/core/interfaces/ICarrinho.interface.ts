import { IItem } from "./IItem.interface";

export interface ICarrinho {
  id: number;
  total: number;
  itens: IItem[]
}


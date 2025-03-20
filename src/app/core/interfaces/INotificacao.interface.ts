export interface ICreateNotificacao {
  titulo: string;
  paragrafo_1: string;
  paragrafo_2?: string;
}

export interface IConectarInstancia {
  instanceName: string;
}

export interface IResponseConectarInstancia {
  base64: string;
}



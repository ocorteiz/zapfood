export interface ILoja {
  id: number;
  nome: string;
  descricao: string;
  endereco: string;
  logo: string;
  corDeTema: string;
  linkDeWhatsapp: string;
  status: boolean;
  diaInicio: string;
  diaFim: string;
  horarioInicio: string;
  horarioFim: string;
}

export interface ILojaCredenciais {
  email: string;
  senha: string;
}

export interface ILojaToken {
  token: string;
}



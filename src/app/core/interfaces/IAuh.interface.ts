export interface IAuth {
  id: number;
  nome: string;
  token: string;
}

export interface IRegister {
  nome: string;
  telefone: string;
  password: string;
  confirmePassowrd: string
}

export interface ILogin {
  telefone: string | null;
  password: string | null;
}

export interface IUpdateUsuario {
  nome: string | null;
  telefone: string | null;
}


export interface ILogout {
  message: string;
}

export interface ICodigoResponse {
  codigo: number | null;
}

export interface ICodigoRequest {
  telefone: string | null;
}

export interface IUsuarioValidar {
  id?: number | null
  nome?: string | null;
  telefone?: string | null;
  password?: string | null;
  codigoGerado?: number | null;
  codigoEscrito?: number | null;
}

export interface ICodigoValidar {
  codigoGerado: number | null;
  codigoEscrito: number | null;
  password: string | null;
}








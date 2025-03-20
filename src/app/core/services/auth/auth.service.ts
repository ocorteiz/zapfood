import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { IAuth, ICodigoResponse, ICodigoValidar, ILogin, ILogout, IRegister, IUpdateUsuario, IUsuarioValidar } from '../../interfaces/IAuh.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  #http = inject(HttpClient);
  #url = environment.api;

  constructor() { }

  httpRegisterCliente$(usuario: IRegister): Observable<ICodigoResponse> {
    const apiUrl = `${this.#url}/auth/register-cliente`
    return this.#http.post<ICodigoResponse>(apiUrl, usuario).pipe(
    );
  };

  httpLogin$(usuario: ILogin): Observable<IAuth> {
    const apiUrl = `${this.#url}/auth/login`
    return this.#http.post<IAuth>(apiUrl, usuario)
  };

  httpRecuperarSenha$(usuario: ILogin): Observable<ICodigoResponse> {
    const apiUrl = `${this.#url}/auth/recuperar`
    return this.#http.post<ICodigoResponse>(apiUrl, usuario)
  };

  httpLogout$(): Observable<ILogout> {
    const apiUrl = `${this.#url}/auth/logout`
    return this.#http.post<ILogout>(apiUrl, {})
  }

  httpValidarUsuario$(body: IUsuarioValidar): Observable<boolean> {
    const apiUrl = `${this.#url}/auth/validar`
    return this.#http.post<boolean>(apiUrl, body)
  }

  httpUpdateSenha$(telefone: string | null, body: ICodigoValidar): Observable<void> {
    const apiUrl = `${this.#url}/cliente/${telefone}/senha`
    return this.#http.put<void>(apiUrl, body)
  }

  httpUpdateCliente$(body: IUpdateUsuario): Observable<ICodigoResponse> {
    const apiUrl = `${this.#url}/auth/cliente`
    return this.#http.put<ICodigoResponse>(apiUrl, body)
  }

  httpValidarTelefone$(body: IUsuarioValidar): Observable<boolean> {
    const apiUrl = `${this.#url}/auth/telefone`
    return this.#http.post<boolean>(apiUrl, body)
  }

}

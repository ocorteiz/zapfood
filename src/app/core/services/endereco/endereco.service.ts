import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, shareReplay } from 'rxjs';
import { IBairro, IBairroCreate, IBairroUpdate, IEndereco, IEnderecoCreate } from '../../interfaces/IEndereco.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  #url = environment.api;
  #http = inject(HttpClient);

  constructor() { }

  // ENDEREÇO

  httpFindEnderecosByCliente$(idCliente: number): Observable<IEndereco[]> {
    const apiUrl = `${this.#url}/endereco/${idCliente}/cliente`
    return this.#http.get<IEndereco[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  httpCreateEndereco$(idCliente: number, endereco: IEnderecoCreate): Observable<void> {
    const apiUrl = `${this.#url}/endereco/${idCliente}`
    return this.#http.post<void>(apiUrl, endereco).pipe(
      shareReplay()
    );
  };

  httpDeleteEndereco$(idEndereco: number): Observable<void> {
    const apiUrl = `${this.#url}/endereco/${idEndereco}`
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  // BAIRRO

  httpFindAllBairro$(): Observable<IBairro[]> {
    const apiUrl = `${this.#url}/bairro`
    return this.#http.get<IBairro[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  httpCreateBairro$(bairro: IBairroCreate): Observable<void> {
    const apiUrl = `${this.#url}/bairro`
    return this.#http.post<void>(apiUrl, bairro).pipe(
      shareReplay()
    );
  };

  httpUpdateBairro$(idBairro: number | null, bairro: IBairroUpdate): Observable<void> {
    const apiUrl = `${this.#url}/bairro/${idBairro}`
    return this.#http.put<void>(apiUrl, bairro).pipe(
      shareReplay()
    );
  };

  httpFreteGratis$(): Observable<void> {
    const apiUrl = `${this.#url}/bairro/frete-gratis`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  httpDeleteBairro$(idBairro: number): Observable<void> {
    const apiUrl = `${this.#url}/bairro/${idBairro}`
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

}

import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ICupom, ICupomCreate, ICupons } from '../../interfaces/ICupom.interface';
import { ICliente } from '../../interfaces/ICliente.interface';

@Injectable({
  providedIn: 'root'
})
export class CupomService {

  #url = environment.api;
  #http = inject(HttpClient);

  constructor() { }


  // CRIAR CUPOM

  httpCreateCupom$(cupom: ICupomCreate): Observable<void> {
    const apiUrl = `${this.#url}/cupom`
    return this.#http.post<void>(apiUrl, cupom).pipe(
      shareReplay()
    );
  };

  // GET CUPONS

  httpFindAllCupom$(): Observable<ICupons[]> {
    const apiUrl = `${this.#url}/cupom`
    return this.#http.get<ICupons[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET CUPONS (DE CLIENTE)

  httpFindCuponsByCliente$(idCliente: number): Observable<ICupom[]> {
    const apiUrl = `${this.#url}/cupom/${idCliente}/cliente`
    return this.#http.get<ICupom[]>(apiUrl).pipe(
      shareReplay()
    );
  };


  // DESATIVAR CUPOM

  httpDesativarCupom$(idCupom: number): Observable<void> {
    const apiUrl = `${this.#url}/cupom/${idCupom}/desativar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // ATIVAR CUPOM

  httpAtivarCupom$(idCupom: number): Observable<void> {
    const apiUrl = `${this.#url}/cupom/${idCupom}/ativar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // DELETAR CUPOM

  httpDeleteCupom$(idCupom: number): Observable<void> {
    const apiUrl = `${this.#url}/cupom/${idCupom}`
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET CLIENTES COM CUPOM

  httpFindClientesByCupom$(idCupom: number | null): Observable<ICliente[]> {
    const apiUrl = `${this.#url}/cupom/${idCupom}/by-cupom`
    return this.#http.get<ICliente[]>(apiUrl).pipe(
      shareReplay()
    );
  }

  // GET CLIENTES SEM CUPOM

  httpFindClientesWhitoutCupom$(idCupom: number | null): Observable<ICliente[]> {
    const apiUrl = `${this.#url}/cupom/${idCupom}/whitout-cupom`
    return this.#http.get<ICliente[]>(apiUrl).pipe(
      shareReplay()
    );
  }

  // ADD CUPOM A CLIENTE

  httpAddCupomToCliente$(idCupom: number | null, idsClientes: number[]): Observable<ICliente[]> {
    const apiUrl = `${this.#url}/cupom/${idCupom}/adicionar-cupom`
    return this.#http.put<ICliente[]>(apiUrl, idsClientes).pipe(
      shareReplay()
    );
  }

  // REMOVE CUPOM DE CLIENTES

  httpRemoveCupomToCliente$(idCupom: number | null, idsClientes: number[]): Observable<ICliente[]> {
    const apiUrl = `${this.#url}/cupom/${idCupom}/remove-cupom`
    return this.#http.put<ICliente[]>(apiUrl, idsClientes).pipe(
      shareReplay()
    );
  }

  // RESGATAR CUPOM

  httpResgatarCupom$(idCliente: number | null, codigo: string): Observable<void> {
    const apiUrl = `${this.#url}/cupom/resgate?idCliente=${idCliente}&codigo=${codigo}`
    return this.#http.post<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  }

}

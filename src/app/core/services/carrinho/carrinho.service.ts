import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { ICarrinho } from '../../interfaces/ICarrinho.interface';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  #url = environment.api;
  #http = inject(HttpClient);

  constructor() { }

  httpfindByCarrinho$(idCliente: number | null): Observable<ICarrinho> {
    const apiUrl = `${this.#url}/carrinho/${idCliente}/cliente`
    return this.#http.get<ICarrinho>(apiUrl).pipe(
      shareReplay()
    );
  };

}

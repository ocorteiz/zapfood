import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, shareReplay } from 'rxjs';
import { IToken, ITokenMP } from '../../interfaces/IToken.interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  #http = inject(HttpClient);
  #url = environment.api

  // FIND BY ID TOKEN
  httpFindByIdToken$(): Observable<IToken> {
    const apiUrl = `${this.#url}/token`
    return this.#http.get<IToken>(apiUrl).pipe(
      shareReplay()
    )
  }


  // UPDATE MP TOKENS
  httpUpdateMPTokens$(body: ITokenMP): Observable<void> {
    const apiUrl = `${this.#url}/token/mPToken`
    return this.#http.put<void>(apiUrl, body).pipe(
      shareReplay()
    )
  }

}

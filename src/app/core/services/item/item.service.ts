import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IItemCreate } from '../../interfaces/IItem.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  #url = environment.api;
  #http = inject(HttpClient);

  constructor() { }

  httpCreate(idCliente: number, item: IItemCreate): Observable<void> {
    const apiUrl = `${this.#url}/item/${idCliente}`
    return this.#http.post<void>(apiUrl, item).pipe()
  }

  httpDelete$(id: number): Observable<void> {
    const apiUrl = `${this.#url}/item/${id}`
    return this.#http.delete<void>(apiUrl)
  }

  httpUpdate$(id: number): Observable<void> {
    const apiUrl = `${this.#url}/item/${id}`
    return this.#http.put<void>(apiUrl, null)
  }

}

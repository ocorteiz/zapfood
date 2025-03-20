import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SlugService {

  constructor() { }

  dynamicParam: string = '';

  setParam(param: string) {
    if (typeof window !== "undefined" && window.sessionStorage) {
      sessionStorage.setItem('dynamicParam', param);
    }
  }

  getParam(): string {
    if (typeof window !== "undefined" && window.sessionStorage) {
      return sessionStorage.getItem('dynamicParam') || '';
    }
    return '';
  }


}

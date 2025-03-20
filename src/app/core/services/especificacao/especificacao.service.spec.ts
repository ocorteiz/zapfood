import { TestBed } from '@angular/core/testing';

import { EspecificacaoService } from './especificacao.service';

describe('EspecificacaoService', () => {
  let service: EspecificacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspecificacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

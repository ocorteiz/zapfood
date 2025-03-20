import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkStatusGuard } from './check-status.guard';

describe('checkStatusGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkStatusGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

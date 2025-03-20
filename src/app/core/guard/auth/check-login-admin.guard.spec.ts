import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkLoginAdminGuard } from './check-login-admin.guard';

describe('checkLoginAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkLoginAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

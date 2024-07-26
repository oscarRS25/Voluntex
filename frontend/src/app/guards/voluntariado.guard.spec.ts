import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { voluntariadoGuard } from './voluntariado.guard';

describe('voluntariadoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => voluntariadoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

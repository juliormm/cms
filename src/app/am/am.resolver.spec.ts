/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AmResolver } from './am.resolver';

describe('AmResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmResolver]
    });
  });

  it('should ...', inject([AmResolver], (service: AmResolver) => {
    expect(service).toBeTruthy();
  }));
});

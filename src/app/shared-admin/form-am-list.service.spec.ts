import { TestBed, inject } from '@angular/core/testing';

import { FormAmListService } from './form-am-list.service';

describe('FormAmListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormAmListService]
    });
  });

  it('should ...', inject([FormAmListService], (service: FormAmListService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { TypeheadTagsService } from './typehead-tags.service';

describe('TypeheadTagsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeheadTagsService]
    });
  });

  it('should be created', inject([TypeheadTagsService], (service: TypeheadTagsService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { AfterorderService } from './afterorder.service';

describe('AfterorderService', () => {
  let service: AfterorderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AfterorderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

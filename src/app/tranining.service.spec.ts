import { TestBed } from '@angular/core/testing';

import { TraniningService } from './tranining.service';

describe('TraniningService', () => {
  let service: TraniningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraniningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

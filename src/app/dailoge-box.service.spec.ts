import { TestBed } from '@angular/core/testing';

import { DailogeBoxService } from './dailoge-box.service';

describe('DailogeBoxService', () => {
  let service: DailogeBoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailogeBoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

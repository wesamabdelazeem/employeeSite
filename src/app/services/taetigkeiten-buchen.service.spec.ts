import { TestBed } from '@angular/core/testing';

import { TaetigkeitenBuchenService } from './taetigkeiten-buchen.service';

describe('TaetigkeitenBuchenService', () => {
  let service: TaetigkeitenBuchenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaetigkeitenBuchenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

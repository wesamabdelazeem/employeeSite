import { TestBed } from '@angular/core/testing';

import { TaetigkeitenKorrigierenService } from './taetigkeiten-korrigieren.service';

describe('TaetigkeitenKorrigierenService', () => {
  let service: TaetigkeitenKorrigierenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaetigkeitenKorrigierenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NachverrechnungService } from './nachverrechnung.service';

describe('NachverrechnungService', () => {
  let service: NachverrechnungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NachverrechnungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

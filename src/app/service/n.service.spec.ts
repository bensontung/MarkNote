import { TestBed, inject } from '@angular/core/testing';

import { NService } from './n.service';

describe('NService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NService]
    });
  });

  it('should ...', inject([NService], (service: NService) => {
    expect(service).toBeTruthy();
  }));
});

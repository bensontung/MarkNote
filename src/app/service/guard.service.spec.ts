import { TestBed, inject } from '@angular/core/testing';

import { GuardService } from './guard.service';

describe('GuardServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardService]
    });
  });

  it('should ...', inject([GuardService], (service: GuardService) => {
    expect(service).toBeTruthy();
  }));
});

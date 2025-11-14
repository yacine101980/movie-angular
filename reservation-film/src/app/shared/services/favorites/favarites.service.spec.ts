import { TestBed } from '@angular/core/testing';

import { FavaritesService } from './favarites.service';

describe('FavaritesService', () => {
  let service: FavaritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavaritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ReservationsListService } from './reservations-list.service';

describe('ReservationsListService', () => {
  let service: ReservationsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

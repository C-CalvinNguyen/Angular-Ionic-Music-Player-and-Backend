import { TestBed } from '@angular/core/testing';

import { SongDataService } from './song-data.service';

describe('SongDataService', () => {
  let service: SongDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

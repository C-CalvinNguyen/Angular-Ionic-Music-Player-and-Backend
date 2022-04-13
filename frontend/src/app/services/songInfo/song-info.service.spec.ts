import { TestBed } from '@angular/core/testing';

import { SongInfoService } from './song-info.service';

describe('SongInfoService', () => {
  let service: SongInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

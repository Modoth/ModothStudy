import { TestBed } from '@angular/core/testing';

import { MdReloadService } from './md-reload.service';

describe('MdReloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MdReloadService = TestBed.get(MdReloadService);
    expect(service).toBeTruthy();
  });
});

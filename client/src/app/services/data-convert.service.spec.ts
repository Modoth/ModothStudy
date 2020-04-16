import { TestBed } from '@angular/core/testing';

import { DataConvertService } from './data-convert.service';

describe('DataConvertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataConvertService = TestBed.get(DataConvertService);
    expect(service).toBeTruthy();
  });
});

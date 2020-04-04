import { TestBed } from '@angular/core/testing';

import { ScriptAppService } from './script-app.service';

describe('ScriptAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScriptAppService = TestBed.get(ScriptAppService);
    expect(service).toBeTruthy();
  });
});

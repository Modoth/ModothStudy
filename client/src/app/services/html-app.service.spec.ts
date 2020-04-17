import { TestBed } from '@angular/core/testing';

import { HtmlAppService } from './html-app.service';

describe('HtmlAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmlAppService = TestBed.get(HtmlAppService);
    expect(service).toBeTruthy();
  });
});

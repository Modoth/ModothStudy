import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayPythonComponent } from './play-python.component';

describe('PlayPythonComponent', () => {
  let component: PlayPythonComponent;
  let fixture: ComponentFixture<PlayPythonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayPythonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayPythonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

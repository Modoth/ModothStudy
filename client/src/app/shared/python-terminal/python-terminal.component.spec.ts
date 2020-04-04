import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PythonTerminalComponent } from './python-terminal.component';

describe('PythonTerminalComponent', () => {
  let component: PythonTerminalComponent;
  let fixture: ComponentFixture<PythonTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PythonTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PythonTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

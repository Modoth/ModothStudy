import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PythonEditorComponent } from './python-editor.component';

describe('PythonEditorComponent', () => {
  let component: PythonEditorComponent;
  let fixture: ComponentFixture<PythonEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PythonEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PythonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

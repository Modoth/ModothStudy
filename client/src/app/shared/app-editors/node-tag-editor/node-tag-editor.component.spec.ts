import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeTagEditorComponent } from './node-tag-editor.component';

describe('NodeTagEditorComponent', () => {
  let component: NodeTagEditorComponent;
  let fixture: ComponentFixture<NodeTagEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeTagEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

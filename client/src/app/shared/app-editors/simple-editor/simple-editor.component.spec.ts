import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SimpleEditorComponent } from "./simple-editor.component";

describe("SimpleEditorComponent", () => {
  let component: SimpleEditorComponent;
  let fixture: ComponentFixture<SimpleEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

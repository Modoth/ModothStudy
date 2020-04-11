import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PythonViewerComponent } from "./python-viewer.component";

describe("PythonViewerComponent", () => {
  let component: PythonViewerComponent;
  let fixture: ComponentFixture<PythonViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PythonViewerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PythonViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

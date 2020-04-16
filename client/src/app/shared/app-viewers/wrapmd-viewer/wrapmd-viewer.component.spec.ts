import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WrapmdViewerComponent } from "./wrapmd-viewer.component";

describe("WrapmdViewerComponent", () => {
  let component: WrapmdViewerComponent;
  let fixture: ComponentFixture<WrapmdViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WrapmdViewerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapmdViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

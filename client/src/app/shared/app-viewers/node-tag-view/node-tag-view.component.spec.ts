import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NodeTagViewComponent } from "./node-tag-view.component";

describe("NodeTagViewComponent", () => {
  let component: NodeTagViewComponent;
  let fixture: ComponentFixture<NodeTagViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NodeTagViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeTagViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

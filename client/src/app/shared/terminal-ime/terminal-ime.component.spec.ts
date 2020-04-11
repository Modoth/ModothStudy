import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TerminalImeComponent } from "./terminal-ime.component";

describe("TerminalImeComponent", () => {
  let component: TerminalImeComponent;
  let fixture: ComponentFixture<TerminalImeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalImeComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalImeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

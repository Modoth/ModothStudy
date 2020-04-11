import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageConfigsComponent } from "./manage-configs.component";

describe("ManageConfigsComponent", () => {
  let component: ManageConfigsComponent;
  let fixture: ComponentFixture<ManageConfigsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageConfigsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageConfigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

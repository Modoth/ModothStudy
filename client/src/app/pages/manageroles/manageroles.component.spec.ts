import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageRolesComponent } from "./manageroles.component";

describe("ManageRolesComponent", () => {
  let component: ManageRolesComponent;
  let fixture: ComponentFixture<ManageRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageRolesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

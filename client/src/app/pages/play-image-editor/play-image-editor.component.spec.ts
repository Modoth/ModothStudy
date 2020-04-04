import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayImageEditorComponent } from './play-image-editor.component';

describe('PlayImageEditorComponent', () => {
  let component: PlayImageEditorComponent;
  let fixture: ComponentFixture<PlayImageEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayImageEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

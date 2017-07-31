import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMessageComponent } from './action-message.component';

describe('ActionMessageComponent', () => {
  let component: ActionMessageComponent;
  let fixture: ComponentFixture<ActionMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

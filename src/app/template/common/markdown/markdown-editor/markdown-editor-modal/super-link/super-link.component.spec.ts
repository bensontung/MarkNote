import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperLinkComponent } from './super-link.component';

describe('SuperLinkComponent', () => {
  let component: SuperLinkComponent;
  let fixture: ComponentFixture<SuperLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

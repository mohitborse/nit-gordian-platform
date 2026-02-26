import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockMenuComponent } from './dock-menu-component';

describe('DockMenuComponent', () => {
  let component: DockMenuComponent;
  let fixture: ComponentFixture<DockMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DockMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

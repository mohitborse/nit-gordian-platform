import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintDashboard } from './sprint-dashboard';

describe('SprintDashboard', () => {
  let component: SprintDashboard;
  let fixture: ComponentFixture<SprintDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

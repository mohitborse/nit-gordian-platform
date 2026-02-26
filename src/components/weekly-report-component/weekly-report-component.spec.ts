import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReportComponent } from './weekly-report-component';

describe('WeeklyReportComponent', () => {
  let component: WeeklyReportComponent;
  let fixture: ComponentFixture<WeeklyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyReportComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

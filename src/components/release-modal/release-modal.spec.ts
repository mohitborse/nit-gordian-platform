import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseModalComponent } from '../../components/release-modal/release-modal';

describe('ReleaseModalComponent', () => {
  let component: ReleaseModalComponent;
  let fixture: ComponentFixture<ReleaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

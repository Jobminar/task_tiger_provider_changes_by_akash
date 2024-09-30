import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOtpComponent } from './work-otp.component';

describe('WorkOtpComponent', () => {
  let component: WorkOtpComponent;
  let fixture: ComponentFixture<WorkOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

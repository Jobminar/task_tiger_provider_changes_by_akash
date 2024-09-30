import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAfterWorkComponent } from './verify-after-work.component';

describe('VerifyAfterWorkComponent', () => {
  let component: VerifyAfterWorkComponent;
  let fixture: ComponentFixture<VerifyAfterWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyAfterWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyAfterWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

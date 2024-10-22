import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqschatsComponent } from './faqschats.component';

describe('FaqschatsComponent', () => {
  let component: FaqschatsComponent;
  let fixture: ComponentFixture<FaqschatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FaqschatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FaqschatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArviedComponent } from './arvied.component';

describe('ArviedComponent', () => {
  let component: ArviedComponent;
  let fixture: ComponentFixture<ArviedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArviedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArviedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

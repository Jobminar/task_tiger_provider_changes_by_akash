import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailougeBoxComponent } from './dailouge-box.component';

describe('DailougeBoxComponent', () => {
  let component: DailougeBoxComponent;
  let fixture: ComponentFixture<DailougeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DailougeBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailougeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

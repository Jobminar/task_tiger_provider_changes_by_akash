import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartWorkComponent } from './start-work.component';

describe('StartWorkComponent', () => {
  let component: StartWorkComponent;
  let fixture: ComponentFixture<StartWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StartWorkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

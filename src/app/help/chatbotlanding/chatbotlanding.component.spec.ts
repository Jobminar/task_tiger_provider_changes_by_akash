import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotlandingComponent } from './chatbotlanding.component';

describe('ChatbotlandingComponent', () => {
  let component: ChatbotlandingComponent;
  let fixture: ComponentFixture<ChatbotlandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatbotlandingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotlandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

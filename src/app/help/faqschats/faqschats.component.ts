import { Component } from '@angular/core';
import { predefinedQA } from '../../../models/preDefinedQA';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faqschats',
  templateUrl: './faqschats.component.html',
  styleUrl: './faqschats.component.css'
})
export class FaqschatsComponent {
  messages: { sender: string; text: string }[] = [];
  currentQuestions: { question: string; answer: string }[] | null = null;
  clickedQuestions: string[] = [];
  isOptionVisible = true;
  isLoading = false;
  predefinedQA = predefinedQA;
  constructor(private readonly location:Location,
              private readonly router:Router
  ){

  }
  getMessageWidth(length: number): string {
    if (length <= 10) return '10%';
    if (length <= 30) return '17%';
    if (length <= 50) return '23%';
    if (length <= 60) return '35%';
    return '39%';
  }

  handleCategoryClick(category: any): void {
    this.currentQuestions = category.questions;
    this.messages.push({ sender: 'bot', text: `You selected: ${category.category}` });
    this.isOptionVisible = false;
  }

  handleQuestionClick(question: string, answer: string): void {
    this.messages.push({ sender: 'user', text: question });
    this.isLoading = true;

    setTimeout(() => {
      this.messages.push({ sender: 'bot', text: answer });
      this.isLoading = false;
    }, 1000);

    this.clickedQuestions.push(question);
  }

  // Method to reset to the predefined question categories
  resetToPredefinedQuestions(): void {
    this.currentQuestions = null;
    this.isOptionVisible = true;
    this.clickedQuestions = [];
  }
  navToBack(){
    this.location.back();
  }
  navToChatBot(){
    const role='admin'
    this.router.navigate(['help/chatlanding',role])
  }
}


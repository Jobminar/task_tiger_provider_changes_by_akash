import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqschatsComponent } from './faqschats/faqschats.component';
import { ChatbotlandingComponent } from './chatbotlanding/chatbotlanding.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


const routes:Routes=[
  {path:'',component:FaqschatsComponent},
  {path:'faqs',component:FaqschatsComponent},
  {path:'chatlanding/:role',component:ChatbotlandingComponent},
  {path:'chatbot',component:ChatbotComponent}
]

@NgModule({
  declarations: [
    FaqschatsComponent,
    ChatbotlandingComponent,
    ChatbotComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class HelpModule { }

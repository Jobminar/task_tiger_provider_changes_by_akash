import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DailogeBoxService } from '../dailoge-box.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  rating: number = 0; // Initially no rating is selected
  userFeedback: string = ''; // Stores user's feedback text
  userId:string='';
  orderHistoryId:string='';
  constructor (private readonly location:Location,
              private readonly routerParam:ActivatedRoute,
              private readonly afterOrderService:AfterorderService,
              private readonly dailougeBoxService:DailogeBoxService,
              private readonly router:Router
  ){
    this.getUser();
  }


  // extracting userId and order history id from url
  getUser(){
    this.routerParam.queryParams.subscribe({
      next:(res)=>{
        this.userId=res['userId'];
        this.orderHistoryId=res['orderHistoryId'];
      }
    })
  }
  // Function to handle the star rating
  rate(stars: number) {
    this.rating = stars; // Set rating based on the star clicked
  }

  // Function to submit feedback
  submitFeedback() {
    if (this.rating === 0) {
      alert("Please provide a rating before submitting.");
      return;
    }

    if (this.userFeedback.trim() === '') {
      alert("Please provide your feedback before submitting.");
      return;
    }

    // Here you can handle the submission of feedback (send to server or display, etc.)
    console.log("Rating:", this.rating);
    console.log("Feedback:", this.userFeedback);
    console.log(this.userId);
    const requestBody={
      userId: this.userId,
      providerId: localStorage.getItem('providerId'),
      orderHistoryId:this.orderHistoryId,
      rating: this.rating,
      description:this.userFeedback
    }
    console.log(requestBody);
    this.afterOrderService.feedBack(requestBody).subscribe({
      next:(res)=>{
        console.log(res);
        this.dailougeBoxService.openDialog('feedback send sucessfully');
        this.router.navigate(['home']);
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err);
      }
    })
   
    // Reset after submission
    this.rating = 0;
    this.userFeedback = '';
  }

  navToBack(){
    this.location.back();
  }
}

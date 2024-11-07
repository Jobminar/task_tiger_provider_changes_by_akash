import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {  Component,  } from '@angular/core';
import { Router } from '@angular/router';
import { RazorpayService } from '../razorpay.service';
import { azureApi } from '../../constents/apis';
import { JobDetailsService } from '../job-details.service';
import { catchError, forkJoin, of } from 'rxjs';
@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrl: './target.component.css'
})
export class TargetComponent {
 
  private apiUrl=azureApi;
  enteredValue: number = 0;
  maxValue: number = 5; // You can adjust the max value as needed
  // color: string = 'primary'; 
  minTarget:any=0;
  min:any=80;
  divColor:string='black';
  providerRating:number=0;
  creditBalance:number=50;
  constructor( private http:HttpClient,
                private router:Router,
                private razorpayService:RazorpayService,
                private jobDetailsService:JobDetailsService
  )
  {
    this.colorChange();
    this. getTarget();
    this.getCredits();
    this.getProviderRating();
    this.getData();
  }


  getCredits(){
    this.razorpayService.getCredits().subscribe({
      next:(response)=>{
        console.log(response);
        this.credits=response.credits;
    
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  getProviderRating(){
    this.jobDetailsService.getRating().subscribe({
      next:(res)=>{
        console.log(res);
        this.providerRating=parseInt(res.averageRating);
      },error:(err:HttpErrorResponse)=>{
        console.log(err);
      }
    })
  }

  colorChange()
  {
    if (this.minTarget<this.min) {
      this.divColor='red'
    } else {
      
    }
  }

  calculateProgress(value: number, max: number): number {
    const enteredValue=value+5
    if (max === 0) {
      return 0;
    }
    return (enteredValue / max) * 100;
  }
  isDrawerOpen: boolean = false;

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.router.navigate(['menu'])
  }
  current: number = 0;
  max: number = 5;
  radius: number = 150;
  semicircle: boolean = true;
  color: string = 'black';
  background: string = '#eaeaea';
  cancelRate:number=0;
  workingHours:number=0;
  credits:number=0;
  increment(amount = 1) {
    this.current += amount;
  }

  getOverlayStyle() {
    const isSemi = this.semicircle;
    const transform = (isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';

    return {
      top: isSemi ? 'auto' : '50%',
      bottom: isSemi ? '5%' : 'auto',
      left: '50%',
      transform,
      'font-size': this.radius / 3.5 + 'px',
    };
  }

  getTarget(){
    const providerId=localStorage.getItem('providerId')
    // const api=`https://api.coolieno1.in/v1.0/providers/service-provider-targets/${providerId}`
    const api=`${this.apiUrl}providers/service-provider-targets/${providerId}`
    this.http.get<any>(api).subscribe(
      (response)=>{
        console.log(response);
        this.current=response.specialRating;
        this.minTarget=response.responseRate
        this.cancelRate=response.cancellationRate;
        this.workingHours=response.totalWorkingHours;
        // this.credits=response[0].credits;
      },
      (error)=>{
        console.log(error);
      }
    )
  }

  promos:any;
  promoMilestones: number[] = [100, 250, 400, 650]; 
  getData(){
    const ids = ['6701477d6cdbd8a62eb1bafd', '6701477d6cdbd8a62eb1bb0', '6701477d6cdbd8a62eb1bb03'];
const requests = ids.map(id => 
  this.http.get(`${this.apiUrl}admin/admin-provider-promotions/${id}`)
    .pipe(
      catchError(error => {
        console.error(`Error fetching data for ID ${id}:`, error);
        return of(null); // Return null or an empty object if there's an error
      })
    )
);

forkJoin(requests).subscribe(results => {
  const successfulResults = results.filter(result => result !== null); // Filter out failed responses if needed
  console.log(successfulResults.flat()); // Only successful responses
  this.promos=successfulResults.flat().filter((res:any)=> res.status==='Active');
});
  }
  navTo(nav:string){
    switch(nav){
      case 'credit': this.router.navigate(['credits']);
      break;
      case 'notification':this.router.navigate(['notification']);
      break;
      case 'buyNow': this.router.navigate(['addCredit'])
    }
  }
  navToDetails(){
    this.router.navigate(['credits']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GetOrdersService } from '../get-orders.service';
import { UserDetailsService } from '../user-details.service';
import { LoginServiceService } from '../login-service.service';
import { catchError, combineLatest, forkJoin, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { azureApi } from '../../constents/apis';
import { DailogeBoxService } from '../dailoge-box.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
    constructor(private router:Router,
      private dailougeBoxService:DailogeBoxService,
                private http:HttpClient,
                private userDetailsService:UserDetailsService,
                private logInService:LoginServiceService,
                private getOrderService:GetOrdersService
    ){


      setTimeout(()=>{
        console.log(localStorage.getItem('providerId'));
        if (!localStorage.getItem('providerId')) {
          
          this.router.navigate(['log-in']);
        }
        else{
          this.navTo();
        }
      },4000)
    
    
       
      if (this.getOrderService.getOrderId()) {
        setTimeout(()=>{
          this.router.navigate(['getOrder',this.getOrderService.getOrderId])
        },4000)
       
      } 
     
    }

   
navTo() {
  const providerId = localStorage.getItem('providerId');

  const address = this.logInService.getAddress().pipe(
    catchError((error) => {
      console.error('address', error);
      return of('not found'); // Return an empty array in case of error
    })
  );

  const details = this.userDetailsService.getUserDetails(providerId).pipe(
    catchError((error) => {
      console.error('details', error);
      return of('not found'); // Return an empty array in case of error
    })
  );

  const work = this.userDetailsService.getWork(localStorage.getItem('providerId')).pipe(
    catchError((error) => {
      console.error('work', error);
      return of('not found'); // Return an empty array in case of error
    })
  );

  const training = this.http.get<any>(`${azureApi}providers/provider-watched-video/${providerId}`).pipe(
    catchError((error) => {
      console.error('training', error);
      return of('not found'); // Return an empty array in case of error
    })
  );

  combineLatest([details, address, work, training]).subscribe(
    ([response1, response2, response3, response4]:any) => {
      console.log('API 1 Response:', response1);
      console.log('API 2 Response:', response2);
      console.log('API 3 Response:', response3);
      console.log('API 4 Response:', response4);
      const routes = [
        { condition: response1.provider.firstName ? response1 : 'not found', message: 'Please complete your registration', route: 'aboutUser' },
        { condition: response2, message: 'Please complete your registration', route: 'addAddress' },
        { condition: response3, message: 'Please provide your address', route: 'selectWork' },
        { condition: response4 , message: 'Please complete your training', route: 'induction' }
      ];
      
      for (let route of routes) {
        if (route.condition === 'not found') {
          this.dailougeBoxService.openDialog(route.message);
          this.router.navigate([route.route]);
          break;
        }
      }
      
      // If none of the conditions are met, navigate to 'home'
      if (routes.every(route => !route.condition)) {
        this.router.navigate(['home']);
      }
      // Handle responses here
    },
    (error) => {
      // This should not get triggered because each individual observable handles its own error
      console.error('Error in combining responses', error);
    }
  );
}
}

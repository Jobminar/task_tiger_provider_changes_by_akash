import { Component } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { azureApi } from '../../constents/apis';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {
  loading:boolean=false;
  constructor(private logInService:LoginServiceService,
    private router:Router,
    private http:HttpClient)
    {
      this.loading=true;
      this.checkinductionVideosStatus();
    }
    navTo(){
      console.log(localStorage.getItem('providerId'));
      if (localStorage.getItem('providerId')) {
       
        if (this.status) {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['induction']);
        }
       

      }
      else{
        this.router.navigate(['selectAccount'])
      }
    
  }
status:boolean=false;
  checkinductionVideosStatus(){
    const providerId=localStorage.getItem('providerId');
    const api=`${azureApi}providers/provider-watched-video/${providerId}`
    this.http.get<any>(api).subscribe({
      next:(res)=>{
        console.log(res);
        this.loading=false;
        this.status=res.isWatched;
        
      },error:(err:HttpErrorResponse)=>{
        this.loading=false;
        console.log(err);
        this.status=true;
      }
    })
  }
}

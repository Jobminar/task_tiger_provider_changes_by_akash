import { Component } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent {

  constructor(private logInService:LoginServiceService,
    private router:Router)
    {

    }
    navTo(){
      console.log(localStorage.getItem('providerId'));
      if (localStorage.getItem('providerId')) {
        this.router.navigate(['home'])
      }
      else{
        this.router.navigate(['selectAccount'])
      }
    
  }
}

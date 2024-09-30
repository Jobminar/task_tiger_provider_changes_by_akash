import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-waiting-page',
  templateUrl: './waiting-page.component.html',
  styleUrl: './waiting-page.component.css'
})
export class WaitingPageComponent {

  constructor(private readonly router:Router){

  }

  navToHome(){
    this.router.navigate(['home'])
  }
}

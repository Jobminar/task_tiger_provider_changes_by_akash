import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-aadhar-verification',
  templateUrl: './aadhar-verification.component.html',
  styleUrl: './aadhar-verification.component.css'
})
export class AadharVerificationComponent {
  constructor(private router:Router)
  {
    
  }
  verify(){
    console.log("inside");
   this.router.navigate(['pancard'])
  }
}

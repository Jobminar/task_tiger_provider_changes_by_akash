import { Component } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-work-experiance',
  templateUrl: './work-experiance.component.html',
  styleUrl: './work-experiance.component.css'
})
export class WorkExperianceComponent {
  experiance:string | null=''

  constructor(private logInservice:LoginServiceService,
              private router:Router
  ){

  }

  onCheckboxChange(checkboxNumber: string): void {
    if (this.experiance === checkboxNumber) {
      this.experiance = null; // Allow deselection
    } else {
      this.experiance = checkboxNumber;
    }
    console.log('Selected Checkbox:', this.experiance);
   
    // console.log(this.selectedGender);
  }
  sendResponse()
  {

    this.logInservice.setExperiance(this.experiance);
    this.logInservice.setWorkDetails()
    this.router.navigate(['selectWork'])
  }
}

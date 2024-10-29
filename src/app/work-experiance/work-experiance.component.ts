import { Component } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';
import { DailogeBoxService } from '../dailoge-box.service';

@Component({
  selector: 'app-work-experiance',
  templateUrl: './work-experiance.component.html',
  styleUrl: './work-experiance.component.css'
})
export class WorkExperianceComponent {
  experiance:string | null=''

  constructor(private logInservice:LoginServiceService,
              private router:Router,
              private dialogeService:DailogeBoxService
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
    
    // console.log(this.selectedAge,this.selectedExperiance);
    this.logInservice.sendWorkDetails().subscribe(
      (response)=>{
        console.log(response);
        this.dialogeService.openDialog("Service has been added");
        this.logInservice.workId='';
        this.logInservice.setSubCat("");
        this.logInservice.setservices([]);
       this.router.navigate(['selectWork'])
      },(err)=>{
        console.log(err);
        this.dialogeService.openDialog(err.error.message);
      }
    )
  }
}

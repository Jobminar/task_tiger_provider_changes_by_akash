import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';
import { DailogeBoxService } from '../dailoge-box.service';

@Component({
  selector: 'app-about-work',
  templateUrl: './about-work.component.html',
  styleUrl: './about-work.component.css'
})
export class AboutWorkComponent {
  selectedExperiance:string |null=''
  selectedAge:string | null=''
  workSelected=this.loginService.workName;
  constructor(private router:Router,
    private dialogeService:DailogeBoxService,
              private loginService:LoginServiceService){

  }

  sendResponse()
  {
    console.log(this.selectedAge,this.selectedExperiance);
    this.loginService.sendWorkDetails().subscribe(
      (response)=>{
        console.log(response);
        this.loginService.workId='';
        this.loginService.selectedSubCategories='';
        this.loginService.selectedServiceId='';
        console.log(this.loginService.workId,this.loginService.selectedServiceId,this.loginService.selectedSubCategories);
        this.dialogeService.openDialog("Service has been added");
       
       this.router.navigate(['selectWork'])
      },(err)=>{
        console.log(err);
        this.dialogeService.openDialog(err.error.message);
      }
    )
  }

  expSelected(exp:string){
    if (this.selectedExperiance === exp) {
      this.selectedExperiance  = null; // Allow deselection
    } else {
      this.selectedExperiance = exp;
    }
    console.log(this.selectedExperiance);
    if (this.selectedExperiance==='yes') {
    
      this.router.navigate(['workExperiance'])
    }
    else{
      this.loginService.setExperiance('0')
      this.loginService.setWorkDetails()
      
    }
  }


  selectedCheckbox: string | null = null;

  onCheckboxChange(checkboxNumber: string): void {
    if (this.selectedAge === checkboxNumber) {
      this.selectedAge = null; // Allow deselection
    } else {
      this.selectedAge = checkboxNumber;
    }
    console.log('Selected Checkbox:', this.selectedAge);
    this.loginService.setAge(this.selectedAge);
    // console.log(this.selectedGender);
  }
}

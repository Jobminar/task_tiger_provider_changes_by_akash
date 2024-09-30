import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-identity-verification',
  templateUrl: './identity-verification.component.html',
  styleUrl: './identity-verification.component.css'
})
export class IdentityVerificationComponent {
  navToBack(){
    this.location.back()
  }
  constructor(private location:Location)
  {

  }
  // isChecked=false
  toggleCheckbox() {

    // if (this.isChecked) {
    //  this.isChecked=false
    // }
    // else{
    //  this.isChecked=true
    // }
   }
   items:any=[
    {
      name:'Contact Details',
      checked:true
    },
    {
      name:'Aadhar card',
      checked:true
    },
    {
      name:'Bank Details',
      checked:true
    },
    {
      name:'Professional documents',
      checked:false
    }
  ]
}

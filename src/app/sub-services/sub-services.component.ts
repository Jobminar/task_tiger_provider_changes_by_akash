import { Component } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-services',
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css'
})
export class SubServicesComponent {

  constructor(private loginService:LoginServiceService,
              private logInService:LoginServiceService,private router:Router){
    this.loginService.getSubCategory().subscribe(
      (response)=>{
        console.log(response);
        this.items=response;
      },(err)=>{
        console.log(err);
      }
    )

    // this.router.navigate(['aboutWork']);
  }
  send(){
    // this.logInService.setWorkDetails();
    if (this.logInService.selectedSubCategories.length>0) {
      this.router.navigate(['aboutWork'])
    } else {
      alert("Please select atleat one sub-category ")
    }
    
  }
  items:any=[]
  onChange(event: any, item: any){
    const target = event.target as HTMLInputElement;
    console.log(item);
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        const indexOfChecked = this.items.indexOf(item);
        // this.jobDetails.items[indexOfChecked].checked = true;
        // console.log('Item checked:', this.items.indexOf(item));
        // console.log('Item checked:', item.names);
        // console.log('Item checked:', item);
      
        console.log("categoryId",item._);
        this.logInService.setSubCat(item._id);
        // this.logInservice.categoryId=item.id
        // this.logInservice.setWork(item.names,item.id);
        // this.router.navigate(['subServices']);
        // Perform additional actions related to the checked item
      }
    }
  }
}

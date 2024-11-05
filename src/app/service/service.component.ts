import { Component } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';
import { UserDetailsService } from '../user-details.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {
  workSeleceted:any[]=[];
  selectedCatId:string='';
  selectedSubCatId='';
  selectedServicesId:any;
  constructor(
              private readonly location:Location,
              private logInService:LoginServiceService,
              private router:Router,
            private userDetailsService:UserDetailsService){
    

    // this.router.navigate(['aboutWork']);
  }

  ngOnInit(): void {
    this.selectedCatId=this.logInService.workId;
    this.selectedSubCatId=this.logInService.selectedSubCategories;
    this.getServices();
     
  }

  // getting subServices
  getServices(){
    console.log(this.selectedCatId,this.selectedSubCatId," cat ans sub cat ids");
    this.logInService.getServices(this.selectedCatId,this.selectedSubCatId).subscribe(
      (response)=>{
        console.log(response);
        this.items=response;
        this.getWork();
      },(err)=>{
        console.log(err);
      }
    )
  }
  // getting selected services
  getWork(){
    this.userDetailsService.getWork(localStorage.getItem('providerId')).subscribe(
      (response)=>{
          console.log(response);
        //  console.log(response[0].works);
        
         this.workSeleceted=response.works;
         this.autoCheckServices();
      },(err)=>{
        console.log(err);
      }
    )
  }

  autoCheckServices() {
    // Loop through the selected work
    this.workSeleceted.forEach(work => {
      console.log(`Checking work category: ${work.categoryId.name}`);
  
      // Find items that match the categoryId in work
      const matchedItems = this.items.filter((item: any) => item.categoryId._id === work.categoryId._id);
  
      if (matchedItems.length > 0) {
        console.log(`Found matching items for category: ${work.categoryId.name}`);
  
        // Since work.serviceId is a single object, check if it matches any item in matchedItems
        matchedItems.forEach((item: any) => {
          if (item._id === work.serviceId._id) {
            item.checked = true; // Set the item as checked
            console.log(`Checked item: ${item.name} with service: ${work.serviceId.name}`);
          } else {
            console.log(`No match found for service: ${work.serviceId.name} in item: ${item.name}`);
          }
        });
      } else {
        console.log(`No matching items found for categoryId: ${work.categoryId._id}`);
      }
    });
  }
  
  
  
  
  
  
  send(){
    // this.logInService.setWorkDetails();
    if (this.logInService.selectedSubCategories.length>0) {
      this.logInService.setservices(this.selectedServicesId);
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
        console.log('Item checked:', item);
        if (this.logInService.selectedSubCategories.length>0) {
          this.selectedServicesId=item._id;
          this.logInService.setservices(this.selectedServicesId);
          console.log("ready to");
          this.router.navigate(['aboutWork'])
        } else {
          alert("Please select atleat one sub-category ")
        }
        console.log("categoryId",item._);
        // this.logInService.setSubCat(item._id);
      
        // this.logInservice.categoryId=item.id
        // this.logInservice.setWork(item.names,item.id);
        // this.router.navigate(['subServices']);
        // Perform additional actions related to the checked item
      }
    }
    // console.log(this.selectedServicesId);
  }


  navToBack(){
    this.location.back();
  }
}

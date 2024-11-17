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
  selectedCatId:any[]=[];
  selectedSubCatId:any[]=[];
  selectedServicesId:any[]=[];
  constructor(
              private readonly location:Location,
              private logInService:LoginServiceService,
              private router:Router,
            private userDetailsService:UserDetailsService){
    

    // this.router.navigate(['aboutWork']);
  }

  ngOnInit(): void {
    this.selectedCatId=this.logInService.catIdForServices;
    this.selectedSubCatId=this.logInService.selectedSubCategories;
    this.getServices();
     
  }

  // getting subServices
  groupedServicesArray:any;
  getServices(){
    console.log(this.selectedCatId,this.selectedSubCatId," cat ans sub cat ids");
    this.logInService.getServices(this.selectedCatId,this.selectedSubCatId).subscribe({
      next:(response)=>{
        console.log(response);
       
        const grouped = response.services.reduce((acc: { [x: string]: any[]; }, service: { subCategoryId: { _id: any; }; }) => {
          const subCategoryId = service.subCategoryId._id;
          if (!acc[subCategoryId]) {
            acc[subCategoryId] = [];
          }
          acc[subCategoryId].push(service);
          return acc;
        }, {});

        // Extract only the arrays from the grouped object
        this.groupedServicesArray = Object.values(grouped);

        console.log(this.groupedServicesArray); // Log to verify the result
        this.items=response;
        this.getWork();
      },error:(err)=>{
        console.log(err);
      }
  })
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
  
  
  
  
  
  catIds:any[]=[];
  subCatIds:any[]=[];
  serviceIds:any[]=[]
  send(){
    if (this.logInService.selectedSubCategories.length>0) {
      this.logInService.setservices(this.selectedServicesId);
 
     
    } else {
      alert("Please select atleat one sub-category ");
      return;
    }
    // this.logInService.setWorkDetails();
    const requestBody=[{
      categoryId:this.catIds,
      subcategoryId:this.subCatIds,
      serviceId:  this.serviceIds,
      variantName:'normal',
      experience:'2 years'
    }]
    this.logInService.sendWorkDetails(requestBody).subscribe({
      next:(res)=>{
        console.log(res);
        this.logInService.workId=[];
        this.logInService.selectedSubCategories=[];
        this.logInService.selectedServiceId='';
        this.logInService.catIdForServices=[];
        this.router.navigate(['aadharVerify'])
      },error:(err)=>{
        console.log(err);
      }
    })
   
    
  }
  items:any=[] 
  
  onChange(event: any, item: any){
    const target = event.target as HTMLInputElement;
    console.log(item);
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        // const indexOfChecked = this.items.indexOf(item);
        // this.jobDetails.items[indexOfChecked].checked = true;
        // console.log('Item checked:', this.items.indexOf(item));
        // console.log('Item checked:', item.names);
        console.log('Item checked:', item);
        this.catIds.push(item.categoryId._id);
        this.subCatIds.push(item.subCategoryId._id);
        this.serviceIds.push(item._id); 
        if (this.logInService.selectedSubCategories.length>0) {
          // this.selectedServicesId=item._id;
          // this.logInService.setservices(this.selectedServicesId);
          console.log("ready to");
          // this.router.navigate(['aboutWork'])
        } else {
          alert("Please select atleat one sub-category ")
        }
        // console.log("categoryId",item._);
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

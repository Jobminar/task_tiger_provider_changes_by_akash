// import { Component,OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { LoginServiceService } from '../login-service.service';

// @Component({
//   selector: 'app-about-user',
//   templateUrl: './about-user.component.html',
//   styleUrl: './about-user.component.css'
// })
// export class AboutUserComponent implements OnInit{
//   aboutProvider!:FormGroup
//   selectedFile: File | null = null;
//   base64Image:string | ArrayBuffer | null = null;
//   imagePreview: string | ArrayBuffer | null | File= null;
//   selectedWork:string='hello';
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     // this.selectedFile = input.files[0];
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0]
//       this.imagePreview=input.files[0];
//       const file=input.files[0];
     

//       const reader = new FileReader();
//       reader.onload = () => {
//         this.imagePreview = reader.result;
//       };
//       reader.readAsDataURL(this.selectedFile);
//       console.log("image",this.imagePreview);
//       this.aboutProvider.value.image=file
     
      
//     }
//   }
//   constructor( private fb:FormBuilder,
//                 private router:Router,
//                 private loginService:LoginServiceService
//   )
//   {
//     this.aboutProvider = 
//        this.fb.group({
//         userId:localStorage.getItem('providerId'),
//         providerName: ['', Validators.required],
//         work: [[], Validators.required],
//         pincode: ['', Validators.required],
//         radius: ['', Validators.required],
//         phone: this.loginService.getPhoneNumber(),
//         age: this.loginService.age,
//         gender:['',Validators.required],
//         address:['',Validators.required],
//         image: ['']
//       });
//      console.log(this.loginService.workDetails);
//       // this.loginService.workDetails.flatMap()
//       this.selectedWork = this.loginService.workDetails.flatMap(
//         item => item.flatMap((subItem: { nameOfService: any; }) => subItem.nameOfService)
//       ).join(', '); 

//       const setWork = this.loginService.workDetails.flat()
   
//     this.aboutProvider.controls['work'].setValue(setWork);
//       console.log("setWork",setWork);
    
//     console.log(this.aboutProvider.value.image);
//   }
//   ngOnInit(): void {
   
//   }
//   navTo()
//   {
//     this.router.navigate(['selectWork']);
//   }
//   submit(){
//     console.log(this.aboutProvider.value);
//     let formData = new FormData();
//     formData.append('userId',this.aboutProvider.value.userId);
//     formData.append('providerName',this.aboutProvider.value.providerName);
//     formData.append('work', this.aboutProvider.value.work);
//     formData.append('pincode', this.aboutProvider.value.pincode);
//     formData.append('radius', this.aboutProvider.value.radius);
//     formData.append('phone', this.aboutProvider.value.phone);
//     formData.append('age', this.aboutProvider.value.age);
//     formData.append('gender',this.aboutProvider.value.gender)
//    formData.append('address',this.aboutProvider.value.address)
//   //   const work = this.aboutProvider.value.work;
//   //   work.forEach((workArray: any)=>{
//   //   workArray.forEach((workItem: { nameOfService: string; experience: string }) => {
//   //   formData.append('work',workItem.nameOfService);
//   //   formData.append('work',workItem.experience);
//   //   console.log(workItem.nameOfService, workItem.experience);
//   // })})
   
//   const workArray = this.aboutProvider.value.work;
//   console.log(workArray);
//   console.log(JSON.stringify(workArray));
//   formData.append('work', JSON.stringify(this.loginService.workDetails.flat()));
  

//   if (this.selectedFile) {
//       formData.append('image', this.selectedFile, this.selectedFile.name);
//     }
//     setTimeout(() => {
//       console.log(formData);
//     }, 1000);

//     formData.forEach((value, key) => {
//       console.log(key, value);
//     });
//     // console.log(formData);
//     this.loginService.UserDetails(formData)
//     // this.router.navigate(['aadharVerify']);
//   }


// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDetailsService } from '../user-details.service';
import { GoogleMapService } from '../google-map.service';
import { Location } from '@angular/common';
import { DailogeBoxService } from '../dailoge-box.service';

@Component({
  selector: 'app-about-user',
  templateUrl: './about-user.component.html',
  styleUrls: ['./about-user.component.css']
})
export class AboutUserComponent implements OnInit {
  aboutProvider!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  selectedWork: any ;
  userNumber:any;
  loading:boolean=false;
  workAdded:boolean=true;
  language = [
    'Telugu',
     'Hindi',
     'English',
     'Tamil',
     'urudu',
    'marati',
    'kanada'
];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private readonly location:Location,
    private loginService: LoginServiceService,
    private userDetailsService:UserDetailsService,
   
    private dailougeBoxService:DailogeBoxService
  ) {
    
    this.aboutProvider = this.fb.group({
      userId: localStorage.getItem('providerId'),
      firstName: ['', Validators.required],
    
      surname: ['', Validators.required],
        gender: ['', Validators.required],
        DOB:[''],
     
      phoneNumber: [ ""],
      whatsapp:[''],
      age: [ this.loginService.age, Validators.required],
      launguage:this.selectedItems[0],
      email:[''],
   
      // image: ['']
    });

    // Flattening the nested work details array
    // const setWork = this.loginService.workDetails.flat();
    // this.aboutProvider.controls['work'].setValue(setWork);
    // console.log(setWork);
    console.log('inform',this.aboutProvider.value.work);
    this.selectedWork = this.loginService.workDetails.flatMap(
              item => item.flatMap((subItem: { nameOfService: any; }) => subItem.nameOfService)
            ).join(', '); 
  }

  ngOnInit(): void {
    this.getNumber();
    this.getWork();
  }

  getWork() {
    this.userDetailsService.getWork(localStorage.getItem('providerId'))
      .subscribe({
       next:(response) => {
          console.log(response);
          if (response.works.length>0) {
            this.workAdded=false;
          }
        },
        error:(err) => {
          console.log(err);
        }
  });
  }
  async getNumber(){
    const number=this.loginService.getPhoneNumber();
    console.log(number);
    this.userNumber= await this.loginService.userNumber
    console.log(this.userNumber);
  }


  // Utility function to flatten work details array
  private flattenWorkDetails(workDetails: any[]): any[] {
    return workDetails.flatMap(item => item.flatMap((subItem: { nameOfService: any; }) => subItem.nameOfService));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  navTo() {
    this.router.navigate(['selectWork']);
  }

  // submit() {
  //   console.log(this.aboutProvider.value);
  //   const formData = new FormData();
  //   formData.append('providerName', this.aboutProvider.value.providerName);
  //   formData.append('age', this.aboutProvider.value.age);
  //   formData.append('pincode', this.aboutProvider.value.pincode);
  //   formData.append('radius', this.aboutProvider.value.radius);
  //   formData.append('userId', this.aboutProvider.value.userId);
  //   formData.append('gender', this.aboutProvider.value.gender);
  //   formData.append('address', this.aboutProvider.value.address);
  //   formData.append('phone', this.aboutProvider.value.phone);

  //   // Append work array as a JSON string
  //   let work:any=this.loginService.workDetails.flat()
  //   console.log(this.loginService.workDetails);
  //   console.log(work);
  //   console.log(JSON.stringify(work));
  //   formData.append('work', work);

  //   if (this.selectedFile) {
  //     formData.append('image', this.selectedFile, this.selectedFile.name);
  //   }
  //   formData.forEach((value, key) => {
  //     console.log(`${key}: ${value}`);
  //   });
  //   this.loginService.UserDetails(formData)
  

     
  // }
 
  submit() {
    this.loading=true;
   
    const formData = new FormData();
    // Append other fields to formData
    formData.append('firstName', this.aboutProvider.value.firstName);
    formData.append('surName', this.aboutProvider.value.surname);
    formData.append('launguage', this.aboutProvider.value.launguage);
    // formData.append('radius', this.aboutProvider.value.radius);
    formData.append('gender', this.aboutProvider.value.gender);
    formData.append('gmail', this.aboutProvider.value.email);
    formData.append('dateOfBirth', this.aboutProvider.value.DOB);
    formData.append('primaryMobile', this.aboutProvider.value.phoneNumber);
    formData.append('whatsappNumber', this.aboutProvider.value.whatsapp);
    // formData.append('landMark', this.aboutProvider.value.landmark);
    // formData.append('city', this.aboutProvider.value.city);
    // formData.append('state', this.aboutProvider.value.state);
    // formData.append('whatsapp', this.aboutProvider.value.whatsapp);

    // Flatten and stringify the work array
    // let work = this.loginService.workDetails.flat(); // Ensure workDetails is correctly populated
    // formData.append('work', JSON.stringify(work));
  
    // Append the selected file if it exists
    // if (this.selectedFile) {
    //   formData.append('image', this.selectedFile, this.selectedFile.name);
    // }
  
    // Log formData key-value pairs
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    // Send formData to the server
    this.loginService.UserDetails(formData).subscribe({
      next:(res)=>{
        this.loading=false;
        this.dailougeBoxService.openDialog("Details are uploaded sucessfully")
      },error:(err:HttpErrorResponse)=>{
        this.loading=false;
      }
    })
  }
  navToBack(){
    console.log("back");
    this.location.back();
  }
  options = ['Male', 'Female', 'Others']; // Replace with your options
  selectedItems: string[] = [];
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  isSelected(option: string): boolean {
    return this.selectedItems.includes(option);
  }

  onSelect(option: string) {
    if (this.isSelected(option)) {
      this.selectedItems = this.selectedItems.filter(item => item !== option);
    } else {
      this.selectedItems.push(option);
    }
    console.log(this.selectedItems);
  }
}

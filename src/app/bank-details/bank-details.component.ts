// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-bank-details',
//   templateUrl: './bank-details.component.html',
//   styleUrl: './bank-details.component.css'
// })
// export class BankDetailsComponent {
//   bankDetails!: FormGroup;

//   constructor(private fb: FormBuilder,
//               private router:Router,
//               private http:HttpClient
//   ) {
//     this.bankDetails = this.fb.group({
//       accountName:'',
//       accountNumber: '',
//       PANNumber:'',
//       bankName:'',
//       IFSC:'',
//       branch:''
//     });
//   }

//   submit(){

//     const api='https://api.coolieno1.in/v1.0/providers/provider-finance';
//     const requestBody=[{
//       accountName:this.bankDetails.value.accountName,
//      userId:localStorage.getItem('providerId'),
//       gst:"ABC123",
//       accountNumber:this.bankDetails.value.accountNumber,
//       pan:this.bankDetails.value.PANNumber,
//       bankName:this.bankDetails.value.bankName,
//       ifscCode:this.bankDetails.value.IFSC,
//       branch:this.bankDetails.value.branch,
    
//   }]
//   console.log(requestBody);
//     this.http.post(api,requestBody).subscribe(
//       (response)=>{
//         console.log(response);
//         this.router.navigate(['waiting']);
//       },
//       (error)=>{
//         console.log(error);
//       }
//     )
  
//   }
//   skip(){
//     this.router.navigate(['induction'])
//   }
// }



import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { azureApi } from '../../constents/apis';
@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.css']
})
export class BankDetailsComponent {
  bankDetails!: FormGroup;
  private apiUrl=azureApi;
  constructor(private fb: FormBuilder,
              private router: Router,
              private http: HttpClient) {
    this.bankDetails = this.fb.group({
      accountName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      PANNumber: ['', Validators.required],
      bankName: ['', Validators.required],
      IFSC: ['', Validators.required],
      branch: ['', Validators.required],
      aadhaarNumber:532268448050
    });
  }

  submit() {
    

    const api=`${this.apiUrl}providers/provider-finance`
    const formData = new FormData();
    formData.append('accountName', this.bankDetails.value.accountName);
    formData.append('providerId', localStorage.getItem('providerId') || '');
    formData.append('aadhaarNumber',this.bankDetails.value.aadhaarNumber)
    // formData.append('gst', 'ABC121');  // Replace with the actual GST if required
    formData.append('accountNumber', this.bankDetails.value.accountNumber);
    formData.append('pan', this.bankDetails.value.PANNumber);
    formData.append('bankName', this.bankDetails.value.bankName);
    formData.append('ifscCode', this.bankDetails.value.IFSC);
    formData.append('branch', this.bankDetails.value.branch);

    this.http.post(api, formData).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['induction']);
      },
      (error) => {
        console.log(error);
       
        if (error.error.error==="E11000 duplicate key error collection: test.finances index: pan_1 dup key: { pan: \"cggpc1173E\" }") {
          alert("Pancard is already registered");
        }
      }
    );
  }

  skip() {
    this.router.navigate(['induction']);
  }
}

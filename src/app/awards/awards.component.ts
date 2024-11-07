import { Location } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserDetailsService } from '../user-details.service';
import { Subscription } from 'rxjs';
import { azureApi } from '../../constents/apis';
@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrl: './awards.component.css'
})
export class AwardsComponent {
  private apiUrl=azureApi;
  private apiSubscription!:Subscription
  items:any=[];
  bucketName = 'coolie1-dev';
  region = 'ap-south-1';
  userId=localStorage.getItem('providerId')
  imageForm!:FormGroup;
  selectedFile: File | null = null;
  selectedDocument: File | null = null;
  base64Image:string | ArrayBuffer | null = null;
  imagePreview: string | ArrayBuffer | null | File= null;
  documentPreview: string | ArrayBuffer | null | File= null;
  navToBack(){
    this.location.back();
  }
  constructor(private location:Location,
              private http:HttpClient,
              private fb:FormBuilder,
              private readonly userDetalsService:UserDetailsService
  )
  {
    this,this.getCertificates();
    this.imageForm=this.fb.group({
      image:'',
      user:this.userId,
      isverified:false
    })
    console.log(this.items);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    // this.selectedFile = input.files[0];
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]
      this.imagePreview=input.files[0];
      const file=input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      console.log("image",this.imagePreview);
      this.imageForm.value.image=file
    }
    this.sending();
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    // this.selectedFile = input.files[0];
    if (input.files && input.files.length > 0) {
      this.selectedDocument = input.files[0]
      this.imagePreview=input.files[0];
      const file=input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedDocument);
      console.log("image",this.imagePreview,'file',file);
      this.imageForm.value.image=file
    }
    this.sending();
  }

  sending(){
    console.log("sending doc");
    const formData =new FormData();
    formData.append('image',this.imageForm.value.image);
    formData.append('isVerified',this.imageForm.value.isverified);
    formData.append('providerId',this.imageForm.value.user);
   
    const api= this.apiUrl+'providers/provider-certificate';
    this.http.post(api,formData).subscribe({
      next:(response)=>{
        console.log(response);
        this.imageForm.value.image=null;
        this.imagePreview = null; // Clear the preview after successful upload
          this.selectedFile = null; 
        this.getCertificates();
      },
      error:(error)=>{
        console.log(error);
      }
  })

  }

  getCertificates(){
 
    this.userDetalsService.getCertificated(this.userId).subscribe({
     next:(response)=>{
        console.log(response);
        this.items=response;
        console.log(this.items[0].image);
        
      },
      error:(error)=>{
        console.log(error);
      },
      complete:()=>{
        this.apiSubscription?.unsubscribe();
      }
  })
  }

}

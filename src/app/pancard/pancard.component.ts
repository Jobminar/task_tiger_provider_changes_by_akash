import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pancard',
  templateUrl: './pancard.component.html',
  styleUrl: './pancard.component.css'
})
export class PancardComponent {

  // constructor(private router:Router)
  // {

  // }
  // skip(){
  //   this.router.navigate(['bankDetails'])
  // }
  // submit(){
  //   this.router.navigate(['bankDetails'])
  // }


  documentForm: FormGroup;
  previews: { [key: string]: string | ArrayBuffer | null } = {
    aadharFront: null,
    aadharBack: null,
    panCard: null
  };

  constructor(private fb: FormBuilder, private http : HttpClient,private location:Location) {
    this.documentForm = this.fb.group({
      aadharFront: [null],
      aadharBack: [null],
      panCard: [null]
    });
  }

  onFileSelect(event: Event, fieldName: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.documentForm.patchValue({ [fieldName]: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previews[fieldName] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.documentForm.valid) {
      const formData = new FormData();
      for (const field in this.documentForm.value) {
        formData.append(field, this.documentForm.value[field]);
      }

      // Replace with your actual backend URL
      this.http.post('https://your-backend-url.com/upload', formData).subscribe(response => {
        console.log('Upload successful', response);
      });
    }
  }
  navTo(){
    this.location.back();
  }
}

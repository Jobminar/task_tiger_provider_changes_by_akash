import { Location } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-work-image',
  templateUrl: './work-image.component.html',
  styleUrl: './work-image.component.css'
})
export class WorkImageComponent implements OnDestroy{

  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  imageUrl: string | undefined;
  orderHistoryId: string | null = '';
  orderId: string | null = '';
  order: any;
  status:string='';
  constructor(
    private readonly location: Location,
    private readonly routerParam: ActivatedRoute,
    private readonly afterOrderService: AfterorderService,
    private readonly router: Router,
    private readonly orderService:OrdersService
  ) {}

  ngOnInit() {
    this.takePicture();
    this.getOrderId();
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera // Optional: Use CameraSource.Photos to pick from gallery
      });

      this.imageUrl = image.webPath;
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  getOrderId() {
    this.routerParam.paramMap.subscribe({
      next: (res) => {
        const id = res.get('id');
        if (id) {
          const id = res.get('id');
          this.getOrderDetails(id);
        }
      }
    });
  }

  getOrderDetails(orderId: string | null) {
    if (orderId) {
    
      this.afterOrderService.getOrderDetails(orderId).subscribe({
        next: (res) => {
          console.log(res);
          this.order = res;
          this.orderId = res._id;
          this.getingStatus();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
      });
    }
  }

  getingStatus(){
    this.afterOrderService.gettingStatus(this.orderId).subscribe({
      next:(res)=>{
        console.log(res);
        this.status=res.data.status;
        this.orderHistoryId=res.data._id;
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err);
      }
    })
  }

  /**
   * 
   * below submit we are uploading images before work start and after work start
   * both the apis we are changing according to the status of work which we can find in this.order.status
   * if status is 'workStart' we are navigating to complete work and if status is 'inprogress' we are navigating to verify otp 
   * and before navigating we are sending the otp to user by calling the api in orderservice
   */


  async submit() {
    const providerId: string | null = localStorage.getItem('providerId');
    if (!providerId || !this.orderId || !this.imageUrl || !this.order?.userId._id) {
      console.error('Required data is missing');
      return;
    }

    try {
      const response = await fetch(this.imageUrl);
      const blob = await response.blob();

      // Create FormData and append values
      const formData = new FormData();
      formData.append('providerId', providerId);
      formData.append('orderId', this.orderId);
      formData.append('userId', this.order.userId?._id);
      formData.append('image', blob, 'work-image.jpg'); // Append image Blob with a file name

      // // Submit the form data
      if (this.status==='Workstart') {
        this.afterOrderService.uploadBeforeWorkImage(formData).subscribe(
          (response) => {
            console.log('Data submitted successfully:', response);
            this.navToCompleteWork();
          },
          (error) => {
            console.error('Error submitting data:', error);
          }
        );
      }
      if(this.status==='InProgress'){
    
        formData.append('orderHistoryId', this.orderHistoryId || '');

        this.afterOrderService.uploadAfterWorkImage(formData).subscribe({
          next:(res)=>{
            console.log(res);
            this.completeWork();
          },error:(err:HttpErrorResponse)=>{
            console.log(err);
          }
        })
      }
   
    } catch (error) {
      console.error('Error fetching and submitting image:', error);
    }
  }

  // compelete the work 
  completeWork(){
    const userId=this.order.userId?._id;
    const request={
      orderHistoryId:this.orderHistoryId,
      providerId:localStorage.getItem('providerId'),
      userId:userId,
      orderId:this.orderId
    }
    console.log(request);
      this.orderService.completeOrder(request).subscribe({
     next:(response) => {
        console.log(response);
        this.router.navigate(['verifyAfterWork', this.orderId]);
        // this.router.navigate(['workImage', this.orderHistoryId], { replaceUrl: true }).then(() => {
        //   // Replace the current state to prevent back navigation to this page
        //   this.location.replaceState('home');
        // });
      },
      error:(err) => {
        console.log(err);
      }
  });
  }
  navTOBack() {
    this.location.back();
  }

  navToCompleteWork() {
    this.router.navigate(['completeWork', this.orderId]);
  }

  ngOnDestroy(): void {
    this.imageUrl=undefined;
    this.orderHistoryId = '';
    this.orderId= '';
    this.order=[];
  
  }
}

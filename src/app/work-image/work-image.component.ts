import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-work-image',
  templateUrl: './work-image.component.html',
  styleUrl: './work-image.component.css'
})
export class WorkImageComponent {

  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  imageUrl: string | undefined;
  orderHistoryId: string | null = '';
  orderId: string | null = '';
  order: any;

  constructor(
    private readonly location: Location,
    private readonly routerParam: ActivatedRoute,
    private readonly afterOrderService: AfterorderService,
    private readonly router: Router
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
          this.orderHistoryId = res.get('id');
          this.getOrderDetails(this.orderHistoryId);
        }
      }
    });
  }

  getOrderDetails(orderId: string | null) {
    if (orderId) {
      this.orderHistoryId = orderId;
      this.afterOrderService.getOrderDetails(orderId).subscribe({
        next: (res) => {
          this.order = res;
          this.orderId = res.orderId?._id;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
      });
    }
  }

  async submit() {
    const providerId: string | null = localStorage.getItem('providerId');
    if (!providerId || !this.orderId || !this.imageUrl || !this.order?.userId) {
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
      formData.append('userId', this.order.userId);
      formData.append('image', blob, 'work-image.jpg'); // Append image Blob with a file name

      // // Submit the form data
      this.afterOrderService.uploadBeforeWorkImage(formData).subscribe(
        (response) => {
          console.log('Data submitted successfully:', response);
          this.navToCompleteWork();
        },
        (error) => {
          console.error('Error submitting data:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching and submitting image:', error);
    }
  }

  navTOBack() {
    this.location.back();
  }

  navToCompleteWork() {
    this.router.navigate(['completeWork', this.orderHistoryId]);
  }
}

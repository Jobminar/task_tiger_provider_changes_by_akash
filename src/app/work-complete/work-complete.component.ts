import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-work-complete',
  templateUrl: './work-complete.component.html',
  styleUrl: './work-complete.component.css',
})
export class WorkCompleteComponent implements OnInit{
  total: number = 0;
  orderHistoryId: string | null = '';
  order: any;
  work: any = {};
  alreadyHasAccount = false;

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private location: Location,
    private readonly routerParam: ActivatedRoute,
    private readonly afterOrderService: AfterorderService
  ) {}

  ngOnInit(): void {
    this.getOrderId();
  }

  navTOBack() {
    this.location.back();
  }

  getOrderId() {
    this.routerParam.paramMap.subscribe({
      next: (res) => {
        const id = res.get('id');
        if (id) {
          this.orderHistoryId = id;
          this.getOrderDetails(this.orderHistoryId);
        }
      
      },
    });
  }

  getOrderDetails(orderid: string | null) {
    if (orderid) {
      this.afterOrderService.getOrderDetails(orderid).subscribe({
        next: (res) => {
          console.log(res);
          this.order = res;
          this.work = this.order; // Assign the entire order to work
          console.log('work', this.work);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    }
  }

  toggleDisplay() {
    const userId=this.work.userId
    this.router.navigate(['workImage', this.orderHistoryId], { replaceUrl: true });
    // this.orderService.completeOrder(this.orderHistoryId,userId).subscribe(
    //   (response) => {
    //     console.log(response);
    //     // this.router.navigate(['verifyAfterWork',this.orderHistoryId]);
    //     this.router.navigate(['workImage', this.orderHistoryId], { replaceUrl: true }).then(() => {
    //       // Replace the current state to prevent back navigation to this page
    //       this.location.replaceState('home');
    //     });
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
}
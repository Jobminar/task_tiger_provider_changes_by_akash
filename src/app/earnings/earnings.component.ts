

// import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { MatDatepicker } from '@angular/material/datepicker';
// import { Chart, ChartItem, registerables } from 'chart.js/auto';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-earnings',
//   templateUrl: './earnings.component.html',
//   styleUrls: ['./earnings.component.css']
// })
// export class EarningsComponent implements OnInit {
//   public chart: any;
//   earn: number | null = null;
  

//   ngOnInit(): void {
//     this.createChart();
//   }
//   createChart() {
//     // Define the custom plugin
//     const customPlugin = {
//       id: 'customBackground',
//       beforeDraw: (chart: any) => {
//         const ctx = chart.ctx;
//         chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
//           chart.getDatasetMeta(datasetIndex).data.forEach((bar: any, index: number) => {
//             const value = dataset.data[index];
//             const barWidth = bar.width;
//             const barHeight = bar.height;
//             const topY = bar.y;
//             const bottomY = bar.base;
           
//             // Draw the filled part
//             const filledHeight = barHeight * (value / 100);
//             ctx.save();
//             ctx.fillStyle = 'limegreen';
//             ctx.fillRect(bar.x - barWidth / 2, bottomY - filledHeight, barWidth, filledHeight);

          
//             // const unfilledHeight = barHeight - filledHeight;
//             // ctx.fillStyle = 'lightgreen';
//             // ctx.fillRect(bar.x - barWidth / 2, bottomY - barHeight, barWidth, unfilledHeight);
//             // ctx.restore();
//             // console.log(bar.x - barWidth / 2, bottomY - barHeight, barWidth, unfilledHeight);
//           });
//         });
//       }
//     };

//     // Register the custom plugin
//     Chart.register(customPlugin);

//     this.chart = new Chart("MyChart" as ChartItem, {
//       type: 'bar',
//       data: {
//         labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat','Sun'],
//         datasets: [{
//           data: [100, 50, 80, 30, 90, 40,100],
//           backgroundColor: 'rgba(0,0,0,0)' // Set transparent background color initially
//         }]
//       },
//       options: {
//         aspectRatio: 2.5,
//         plugins: {
//           tooltip: {
//             enabled: false // Disable tooltip
//           }
//         },
//         scales: {
//           y: {
//             display: false // Hide y-axis
//           }
//         }
//       }
//     });

//     this.chart.canvas.addEventListener('click', (evt: MouseEvent) => {
//       const points = this.chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
//       if (points.length > 0) {
//         const firstPoint = points[0];
//         const label = this.chart.data.labels[firstPoint.index];
//         const earnings = this.chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
//         this.earn = earnings;
//       }
//     });
//   }
//   years: number[] = [];
//   selectedYear: any='Select Year'
//   displayedYear: any; // New property
//   months = ['January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'];
//   selectedMonth: any='Select Month'
//   constructor() {
//     // Generate the range of years (2022-2030)
//     for (let year = 2022; year <= 2030; year++) {
//       this.years.push(year);
//     }
//     const date=new Date().getDate()
    
    
//   }

//   // Update displayedYear when selection changes (optional)
//   onYearChange() {
//     this.displayedYear = this.selectedYear;
//   }
// }


// import { HttpClient } from '@angular/common/http';
// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Chart, ChartItem, registerables } from 'chart.js/auto';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-earnings',
//   templateUrl: './earnings.component.html',
//   styleUrls: ['./earnings.component.css']
// })
// export class EarningsComponent implements OnInit {
//   @ViewChild('chartContainer') chartContainer!: ElementRef;
//   public chart: any;
//   earn: number | null = null;
//   years: number[] = [];
//   selectedYear: number | string = 'Select Year';
//   selectedMonth: string = 'Select Month';
//   months = ['January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'];

//   constructor(private http: HttpClient) {
//     // Generate the range of years (2022-2030)
//     for (let year = 2022; year <= 2030; year++) {
//       this.years.push(year);
//     }
//   }

//   ngOnInit(): void {
//     this.createChart();
//   }

//   // createChart() {
//   //   this.chart = new Chart("MyChart" as ChartItem, {
//   //     type: 'bar',
//   //     data: {
//   //       labels: [], // Initialize with empty labels
//   //       datasets: [{
//   //         data: [], // Initialize with empty data
//   //         backgroundColor: 'limegreen',
//   //         barThickness: 50,
//   //         barPercentage: 0.5, // Controls the thickness of the bars
//   //         categoryPercentage: 1.0,
//   //       }]
//   //     },
//   //     options: {
//   //       responsive: true,
//   //       maintainAspectRatio: false,
//   //       aspectRatio: 2,
//   //       plugins: {
//   //         tooltip: {
//   //           enabled: false // Disable tooltip
//   //         }
//   //       },
//   //       scales: {
//   //         y: {
//   //           display: false // Show y-axis
//   //         },
//   //         x: {
//   //           display: true, // Show x-axis
//   //           grid: {
//   //             display: false // Hide grid lines on x-axis
//   //           }
//   //         }
//   //       },
       
//   //     }
//   //   });

//   //   this.chart.canvas.addEventListener('click', (evt: MouseEvent) => {
//   //     const points = this.chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
//   //     if (points.length > 0) {
//   //       const firstPoint = points[0];
//   //       const label = this.chart.data.labels[firstPoint.index];
//   //       const earnings = this.chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
//   //       this.earn = earnings;
//   //     }
//   //   });
//   // }
//   createChart() {
//     this.chart = new Chart("MyChart" as ChartItem, {
//       type: 'bar',
//       data: {
//         labels: [], // Initialize with empty labels
//         datasets: [{
//           data: [], // Initialize with empty data
//           backgroundColor: 'limegreen',
//           barPercentage: 0.5, // Controls the thickness of the bars
//         categoryPercentage: 0.8,
//         }]
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//           tooltip: {
//             enabled: false // Disable tooltip
//           }
//         },
//         scales: {
//           y: {
//             display: false // Show y-axis
//           },
//           x: {
//             display: true, // Show x-axis
//             grid: {
//               display: false // Hide grid lines on x-axis
//             }
//           }
//         },
//          // Controls the width of the bars
         
//       }
//     });

//     this.chart.canvas.addEventListener('click', (evt: MouseEvent) => {
//       const points = this.chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
//       if (points.length > 0) {
//         const firstPoint = points[0];
//         const label = this.chart.data.labels[firstPoint.index];
//         const earnings = this.chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
//         this.earn = earnings;
//       }
//     });
//   }
//   onYearMonthChange() {
//     if (this.selectedYear !== 'Select Year' && this.selectedMonth !== 'Select Month') {
//       this.updateChartData(this.selectedYear as number, this.selectedMonth);
//     }
//   }

//   updateChartData(year: number, month: string) {
//     const yearsNumber= Number(year)
//     const monthsNumber=Number(month)
//     // console.log(yearsNumber,monthsNumber);
//     // console.log(typeof yearsNumber, typeof monthsNumber);
//     const id = localStorage.getItem('providerId');
//     const api = `https://appsvc-apibackend-dev.azurewebsites.net/v1.0/providers/earnings/get-earnings/${id}`;

//     this.http.get<any[]>(api).subscribe(
//       (response) => {
//         // console.log(response);
//         const monthIndex = this.months.indexOf(month);
//         const filteredData = response.filter(entry => {
//           const entryDate = new Date(entry.date);
//           // console.log("entryDate",entry.date,"forMonth",entryDate,entryDate.getMonth());
//           // console.log(entryDate.getFullYear(),entryDate.getMonth(), "entered",yearsNumber,monthsNumber);
//           return entryDate.getFullYear() === yearsNumber && entryDate.getMonth() === monthsNumber;
//         });
//         console.log(filteredData);
//         const chartData = this.transformData(filteredData, yearsNumber, monthsNumber);
//         this.chart.data.labels = chartData.labels;
//         this.chart.data.datasets[0].data = chartData.data;
        
//         const containerWidth = this.chartContainer.nativeElement.offsetWidth;
//         console.log(containerWidth);
//         const numBarsToDisplay = 7;
//         const chartWidth = Math.max(containerWidth, numBarsToDisplay * 500);
//         this.chart.canvas.parentNode.style.width = `${chartWidth}px`;

//         this.chart.update();
//       },
//       (error) => {
//         console.error(error);
//       }
//     );
//   }

//   transformData(data: any[], year: number, month: number) {
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
//     const amounts = new Array(daysInMonth).fill(0);

//     data.forEach(entry => {
//       const date = new Date(entry.date);
//       const day = date.getDate();
//       amounts[day - 1] += entry.amount;  // Sum amounts for each day
//     });
//     console.log(labels,amounts);
//     return { labels, data: amounts };
//   }
//  }



// working fine but adding to show as per uber

// import { HttpClient } from '@angular/common/http';
// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Chart, ChartItem, registerables } from 'chart.js/auto';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-earnings',
//   templateUrl: './earnings.component.html',
//   styleUrls: ['./earnings.component.css']
// })
// export class EarningsComponent implements OnInit {
//   @ViewChild('chartContainer') chartContainer!: ElementRef;
//   public chart: any;
//   earn: number | null = null;
//   years: number[] = [];
//   selectedYear: number | string = 'Select Year';
//   selectedMonth: string = 'Select Month';
//   months = ['January', 'February', 'March', 'April', 'May', 'June',
//             'July', 'August', 'September', 'October', 'November', 'December'];
//   currentWeek: number = 0;
//   totalWeeks: number = 0;
//   allChartData: any[] = [];
//   allLabelsData:any[]=[];
//   constructor(private http: HttpClient) {
//     for (let year = 2022; year <= 2030; year++) {
//       this.years.push(year);
//     }
//   }

//   ngOnInit(): void {
//     this.initializeChart();
//   }

//   initializeChart() {
//     const ctx = document.getElementById('MyChart') as ChartItem;
//     this.chart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: [],
//         datasets: [{
//           data: [],
//           backgroundColor: 'limegreen',
//           barPercentage: 0.5,
//           categoryPercentage: 0.8,
//         }]
//       },
//       options: {
//         aspectRatio: 2.5,
//         plugins: {
//           tooltip: {
//             enabled: false
//           }
//         },
//         scales: {
//           y: {
//             display: false
//           },
//           x: {
//             display: true,
//             grid: {
//               display: false
//             }
//           }
//         },
//       }
//     });

//     this.chart.canvas.addEventListener('click', (evt: MouseEvent) => {
//       const points = this.chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
//       if (points.length > 0) {
//         const firstPoint = points[0];
//         const label = this.chart.data.labels[firstPoint.index];
//         const earnings = this.chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
//         this.earn = earnings;
//       }
//     });
//   }

//   onYearMonthChange() {
//     if (this.selectedYear !== 'Select Year' && this.selectedMonth !== 'Select Month') {
//       this.updateChartData(this.selectedYear as number, this.selectedMonth);
//     }
//   }

//   updateChartData(year: number, month: string) {
    
//     const yearsNumber = Number(year);
//     const monthsNumber = Number(month);
//     const id = localStorage.getItem('providerId');
//     const api = `https://appsvc-apibackend-dev.azurewebsites.net/v1.0/providers/earnings/get-earnings/${id}`;

//     this.http.get<any[]>(api).subscribe(
//       (response) => {
//         console.log(response);
//         const sortedTransactions = response.sort((a, b) => {
//           const dateA = new Date(a.date);
//           const dateB = new Date(b.date);
//           return dateA.getTime() - dateB.getTime();
//         });
        
//         console.log(sortedTransactions.reverse());
//         const monthIndex = this.months.indexOf(month);
//         const filteredData = response.filter(entry => {
//           const entryDate = new Date(entry.date);
//           return entryDate.getFullYear() === yearsNumber && entryDate.getMonth() === monthsNumber;
//         });
//         console.log(filteredData);
//         const chartData = this.transformData(filteredData, yearsNumber, monthsNumber);
//         this.allChartData = chartData.data;
//         console.log(this.allChartData);
//         this.allLabelsData=chartData.labels;
//         console.log(chartData.labels);
//         this.totalWeeks = Math.ceil(this.allChartData.length / 7);
//         this.currentWeek = 0;
//         this.displayCurrentWeek();
//       },
//       (error) => {
//         console.error(error);
//       }
//     );
//   }

//   transformData(data: any[], year: number, month: number) {
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
//     const amounts = new Array(daysInMonth).fill(0);

//     data.forEach(entry => {
//       const date = new Date(entry.date);
//       const day = date.getDate();
//       amounts[day - 1] += entry.amount;
//     });
//     console.log(labels);
//     return { labels, data: amounts };
//   }

//   displayCurrentWeek() {
//     const start = this.currentWeek * 7;
//     const end = start + 7;
//     console.log(this.allLabelsData);
//     const weekLabels = this.allLabelsData.slice(start, end);
//     console.log( weekLabels);
//     const weekData = this.allChartData.slice(start, end);

//     this.chart.data.labels = weekLabels;
//     this.chart.data.datasets[0].data = weekData;
//     console.log(weekLabels);
//     console.log( weekData);
//     this.chart.update();
//   }

//   previousWeek() {
//     if (this.currentWeek > 0) {
//       this.currentWeek--;
//       this.displayCurrentWeek();
//     }
//   }

//   nextWeek() {
//     if (this.currentWeek < this.totalWeeks - 1) {
//       this.currentWeek++;
//       this.displayCurrentWeek();
//     }
//   }
// }



import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, ChartItem, registerables } from 'chart.js/auto';
import { RazorpayService } from '../razorpay.service';
import { azureApi } from '../../constents/apis';
import { UserDetailsService } from '../user-details.service';
Chart.register(...registerables);

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.css']
})
export class EarningsComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  public chart: any;
  private apiUrl=azureApi;
  earn: number | null = null;
  years: number[] = [];
  selectedYear: number = 0;
  selectedMonth: number  = 0;
  months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
  currentWeek: number = 0;
  totalWeeks: number = 0;
  allChartData: any[] = [];
  allLabelsData: any[] = [];
  dateRange: string = '';
  credits:any;
  constructor(private http: HttpClient,
              private router:Router,
              private userDetailsService:UserDetailsService,
              private razorpayService:RazorpayService
  ) {
    
    for (let year = 2022; year <= 2030; year++) {
      this.years.push(year);
    }
  }

  ngOnInit(): void {
   
    this.initializeChart();
    this.loadDefaultEarnings();
    this.getCredits();
  }

 
  getCredits(){
    this.razorpayService.getCredits().subscribe({
      next:(response)=>{
        console.log(response);
        this.credits=response.credits;
    
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  initializeChart() {
    const ctx = document.getElementById('MyChart') as ChartItem;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: 'limegreen',
          barPercentage: 0.8,
          categoryPercentage: 0.8,
        }]
      },
      options: {
        aspectRatio: 1.8,
        plugins: {
          tooltip: {
            enabled: false
          }
        },
        scales: {
          y: {
            display: false
          },
          x: {
            display: true,
            grid: {
              display: false
            }
          }
        },
      }
    });

    this.chart.canvas.addEventListener('click', (evt: MouseEvent) => {
      const points = this.chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, false);
      if (points.length > 0) {
        const firstPoint = points[0];
        const label = this.chart.data.labels[firstPoint.index];
        const earnings = this.chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
        this.earn = earnings;
      }
    });
  }

  loadDefaultEarnings() {
    const today = new Date();
    this.selectedYear = today.getFullYear();
    this.selectedMonth = today.getMonth();
    this.updateChartData(this.selectedYear, this.selectedMonth as number);
  }

  onYearMonthChange() {
    if (this.selectedYear !== 0 && this.selectedMonth !== 0) {
      this.updateChartData(this.selectedYear as number, this.selectedMonth as number);
    }
  }

  updateChartData(year: number, month: number) {
    const id = localStorage.getItem('providerId');
    // const api = `https://api.coolieno1.in/v1.0/providers/earnings/get-earnings/${id}`;
    const api=`${this.apiUrl}providers/provider-earnings/get-earnings/${id}`
    this.http.get<any[]>(api).subscribe(
      (response) => {
        console.log('API Response:', response);

        const sortedTransactions = response.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });

        const filteredData = sortedTransactions.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getFullYear() === year && entryDate.getMonth() === month;
        });

        console.log('Filtered Data:', filteredData);

        const chartData = this.transformData(filteredData, year, month);
        this.allChartData = chartData.data;
        this.allLabelsData = chartData.labels;
        this.totalWeeks = Math.ceil(this.allChartData.length / 7);
        this.currentWeek = 0;
        this.displayCurrentWeek();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  transformData(data: any[], year: number, month: number) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    const amounts = new Array(daysInMonth).fill(0);

    data.forEach(entry => {
      const date = new Date(entry.date);
      const day = date.getDate();
      amounts[day - 1] += entry.amount;
    });

    console.log('Transformed Data:', { labels, amounts });

    return { labels, data: amounts };
  }

  displayCurrentWeek() {
    const start = this.currentWeek * 7;
    const end = start + 7;
    const weekLabels = this.allLabelsData.slice(start, end);
    const weekData = this.allChartData.slice(start, end);

    console.log('Week Labels:', weekLabels);
    console.log('Week Data:', weekData);

    this.chart.data.labels = weekLabels;
    this.chart.data.datasets[0].data = weekData;
    this.chart.update();

    this.updateDateRange(weekLabels);
  }

  updateDateRange(weekLabels: string[]) {
    if (weekLabels.length > 0) {
      const year = this.selectedYear as number;
      const month = this.selectedMonth as number;
      const startDate = new Date(year, month, parseInt(weekLabels[0]));
      const endDate = new Date(year, month, parseInt(weekLabels[weekLabels.length - 1]));
      this.dateRange = `${startDate.toDateString()} - ${endDate.toDateString()}`;
    } else {
      this.dateRange = '';
    }
  }

  previousWeek() {
    this.earn=null;
    if (this.currentWeek > 0) {
      this.currentWeek--;
    } else {
      this.navigateMonth('previous');
    }
    this.displayCurrentWeek();
  }

  nextWeek() {
    this.earn=null
    if (this.currentWeek < this.totalWeeks - 1) {
      this.currentWeek++;
    } else {
      this.navigateMonth('next');
    }
    this.displayCurrentWeek();
  }

  navigateMonth(direction: 'previous' | 'next') {
    if (direction === 'previous') {
      if (this.selectedMonth === 0) {
        if (Number(this.selectedYear) > this.years[0]) {
          
          this.selectedYear--;
          this.selectedMonth = 11;
        }
      } else {
        this.selectedMonth--;
      }
    } else {
      if (this.selectedMonth === 11) {
        if (this.selectedYear < this.years[this.years.length - 1]) {
          this.selectedYear++;
          this.selectedMonth = 0;
        }
      } else {
        this.selectedMonth++;
      }
    }
    this.updateChartData(this.selectedYear as number, this.selectedMonth as number);
  }
  navToCredit(){
    this.router.navigate(['credits'])
    
  }
  navToMenu(){
    this.router.navigate(['menu'])
  }
  navToPackage(){
    this.router.navigate(['packages'])
  }
}


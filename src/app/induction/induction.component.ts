// import { HttpClient } from '@angular/common/http';
// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { TraniningService } from '../tranining.service';

// @Component({
//   selector: 'app-induction',
//   templateUrl: './induction.component.html',
//   styleUrl: './induction.component.css'
// })
// export class InductionComponent implements OnInit{
//   // navBack() {
//   //   // Implement your navigation logic here
//   // }

  
//   // videos: any[] = [];
//   // bucketName = 'coolie1-dev';
//   // region = 'ap-south-1';

//   // constructor(private http: HttpClient, private tranningService: TraniningService) { }

//   // ngOnInit(): void {
//   //   this.gettingVideos();
//   // }

 

//   // gettingVideos() {
//   //   this.tranningService.gettingInductionVeideos().subscribe(
//   //     (response) => {
//   //       console.log(response);
//   //       this.videos = response;
//   //     },
//   //     (error) => {
//   //       console.log(error);
//   //     }
//   //   );
//   // }   

 
//   // currentVideoIndex: number = 0;
//   // lastTime: number = 0;

//   // @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef<HTMLVideoElement> | undefined;

 
//   // skipVideo(): void {
//   //   this.playNextVideo();
//   // }

//   // onVideoEnded(): void {
//   //   this.playNextVideo();
//   // }

//   // onVideoLoaded(videoPlayer: HTMLVideoElement): void {
//   //   // videoPlayer.play();
//   // }

//   // preventSeek(videoPlayer: HTMLVideoElement): void {
//   //   if (videoPlayer.currentTime > this.lastTime + 1) {
//   //     videoPlayer.currentTime = this.lastTime;
//   //   } else {
//   //     this.lastTime = videoPlayer.currentTime;
//   //   }
//   // }

//   // private playNextVideo(): void {
//   //   if (this.currentVideoIndex < this.videos.length - 1) {
//   //     this.currentVideoIndex++;
//   //     this.lastTime = 0;
//   //     this.videoPlayer!.nativeElement.src = this.getVideoUrl(this.currentVideoIndex);
//   //     this.videoPlayer!.nativeElement.play();
//   //   }
//   // }

//   // getVideoUrl(index: number): string {
//   //   return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${this.videos[index].videoKey}`;
//   // }


//   navBack() {
//     // Implement your navigation logic here
//   }

//   videos: any[] = [];
//   pupUp=false
//   bucketName = 'coolie1-dev';
//   region = 'ap-south-1';
//   currentVideoIndex: number = 0;
//   lastTime: number = 0;
//   isVideoPlaying: boolean = false;

//   @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef<HTMLVideoElement> | undefined;
//   @ViewChild('activeVideo', { static: false }) activeVideo: ElementRef<HTMLVideoElement> | undefined;

//   constructor(private http: HttpClient, private tranningService: TraniningService) { }

//   ngOnInit(): void {
//     this.gettingVideos();
//   }

//   gettingVideos() {
//     this.tranningService.gettingInductionVeideos().subscribe(
//       (response) => {
//         console.log(response);
//         this.videos = response;
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//   }

//   playVideo(index: number): void {
//     this.pupUp=true
//     console.log(this.pupUp);
//     this.currentVideoIndex = index;
//     this.isVideoPlaying = true;
//     this.lastTime = 0;
//     if (this.activeVideo && this.activeVideo.nativeElement) {
//       this.activeVideo.nativeElement.src = this.getVideoUrl(this.currentVideoIndex);
//       this.activeVideo.nativeElement.play();
//     }
//   }

//   stopVideo(): void {
//     this.isVideoPlaying = false;
//     if (this.activeVideo && this.activeVideo.nativeElement) {
//       this.activeVideo.nativeElement.pause();
//     }
//   }

//   skipVideo(): void {
//     this.playNextVideo();
//   }

//   onVideoEnded(): void {
//     console.log("ended");
//     this.pupUp=false
//     // this.playNextVideo();
//   }

//   onVideoLoaded(videoPlayer: HTMLVideoElement): void {
//     // console.log("ended");
//     videoPlayer.play();
//   }

//   preventSeek(videoPlayer: HTMLVideoElement): void {
//     if (videoPlayer.currentTime > this.lastTime + 1) {
//       videoPlayer.currentTime = this.lastTime;
//     } else {
//       this.lastTime = videoPlayer.currentTime;
//     }
//   }

//   private playNextVideo(): void {
//     if (this.currentVideoIndex < this.videos.length - 1) {
//       this.currentVideoIndex++;
//       this.lastTime = 0;
//       if (this.activeVideo && this.activeVideo.nativeElement) {
//         this.activeVideo.nativeElement.src = this.getVideoUrl(this.currentVideoIndex);
//         this.activeVideo.nativeElement.play();
//       }
//     } else {
//       this.isVideoPlaying = false;
//     }
//   }

//   getVideoUrl(index: number): string {
//     this.pupUp=true
//     console.log(this.pupUp);
//     return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${this.videos[index].videoKey}`;
//   }
// }


import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TraniningService } from '../tranining.service';
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-induction',
  templateUrl: './induction.component.html',
  styleUrls: ['./induction.component.css']
})
export class InductionComponent implements OnInit {
  navBack() {
    // Implement your navigation logic here
  }

  videos: any[] = [];
  pupUp = false;
  bucketName = 'coolie1-dev';
  region = 'ap-south-1';
  currentVideoIndex: number = 0;
  lastTime: number = 0;
  isVideoPlaying: boolean = false;
  showNavigationButton: boolean = false;

  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('activeVideo', { static: false }) activeVideo: ElementRef<HTMLVideoElement> | undefined;

  constructor(private http: HttpClient,
               private tranningService: TraniningService, 
              private router:  Router,
              private userService:UserDetailsService ) { }

  ngOnInit(): void {
    this.gettingVideos();
    this.getWork();
  }

  gettingVideos() {
    this.tranningService.gettingInductionVeideos().subscribe(
      (response) => {
        console.log(response);
        this.videos = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getWork(){
    this.userService.getWork(localStorage.getItem('providerId')).subscribe(
      (response)=>{
          console.log(response);
          const categoryIds = response.works.map((work: any) => work.categoryId._id);
        //  console.log(response[0].works);
        /**
         * replace the ids with serviceIds to get the dynamic videos
         */
        this.getVideosForIds(["6701477d6cdbd8a62eb1bafa"]);
        //  this.workSeleceted=response.works
      },(err)=>{
        console.log(err);
      }
    )
  }
  getVideosForIds(ids: string[]) {
    console.log(ids);
    this.tranningService.getInductionVideosByIds(ids).subscribe(
      (response) => {
        console.log(response.flat());
        // this.videos = response.filter(video => video !== null); // Filter out any null values
       
      },
      (error) => {
        console.log(error);
      }
    );
  }
  playVideo(index: number): void {
    this.pupUp = true;
    this.currentVideoIndex = index;
    this.isVideoPlaying = true;
    this.lastTime = 0;
    if (this.activeVideo && this.activeVideo.nativeElement) {
      this.activeVideo.nativeElement.src = this.getVideoUrl(this.currentVideoIndex);
      this.activeVideo.nativeElement.play();
    }
  }

  stopVideo(): void {
    this.isVideoPlaying = false;
    if (this.activeVideo && this.activeVideo.nativeElement) {
      this.activeVideo.nativeElement.pause();
    }
  }

  skipVideo(): void {
    this.playNextVideo();
  }

  onVideoEnded(): void {
    this.pupUp = false;
    this.playNextVideo();
  }

  onVideoLoaded(videoPlayer: HTMLVideoElement): void {
    videoPlayer.play();
  }

  preventSeek(videoPlayer: HTMLVideoElement): void {
    if (videoPlayer.currentTime > this.lastTime + 1) {
      videoPlayer.currentTime = this.lastTime;
    } else {
      this.lastTime = videoPlayer.currentTime;
    }
  }

  private playNextVideo(): void {
    if (this.currentVideoIndex < this.videos.length - 1) {
      this.currentVideoIndex++;
      this.lastTime = 0;
      if (this.activeVideo && this.activeVideo.nativeElement) {
        this.activeVideo.nativeElement.src = this.getVideoUrl(this.currentVideoIndex);
        this.activeVideo.nativeElement.play();
      }
    } else {
      this.isVideoPlaying = false;
      alert('Congrats you have completed the traning')
      this.navigateWaiting();
      this.showNavigationButton = true;
    }
  }

  getVideoUrl(index: number): string {
    this.pupUp = true;
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${this.videos[index].videoKey}`;
  }

  navigateWaiting(): void {
    this.router.navigate(['waiting']);
  }
}

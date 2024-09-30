import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { TraniningService } from '../tranining.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent {

  navBack() {
    // Implement your navigation logic here
  }

  videos: any[] = [];
  pupUp=false
  bucketName = 'coolie1-dev';
  region = 'ap-south-1';
  currentVideoIndex: number = 0;
  lastTime: number = 0;
  isVideoPlaying: boolean = false;

  @ViewChild('videoPlayer', { static: false }) videoPlayer: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('activeVideo', { static: false }) activeVideo: ElementRef<HTMLVideoElement> | undefined;

  constructor(private http: HttpClient, private tranningService: TraniningService) { }

  ngOnInit(): void {
    this.gettingVideos();
  }

  gettingVideos() {
    this.tranningService.getingVideos().subscribe(
      (response) => {
        console.log(response);
        this.videos = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  playVideo(index: number): void {
    this.pupUp=true
    console.log(this.pupUp);
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
    console.log("ended");
    this.pupUp=false
    // this.playNextVideo();
  }

  onVideoLoaded(videoPlayer: HTMLVideoElement): void {
    // console.log("ended");
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
    }
  }

  getVideoUrl(index: number): string {
    this.pupUp=true
    console.log(this.pupUp);
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${this.videos[index].videoKey}`;
  }

}

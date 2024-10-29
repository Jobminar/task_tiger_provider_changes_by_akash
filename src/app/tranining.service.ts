import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { azureApi } from '../constents/apis';
@Injectable({
  providedIn: 'root'
})
export class TraniningService {

  private apiUrl=azureApi;
  constructor(private http:HttpClient) { }

  apiForVideo:any= this.apiUrl+'admin'
  getingVideos():Observable<any>
  {
    return this.http.get<any>(`${this.apiForVideo}/training`)
  }

  gettingInductionVeideos():Observable<any>{
    return this.http.get<any>(`${this.apiForVideo}/induction`)
  }

  getVideosByIds(ids: string[]): Observable<any[]> {
    const requests = ids.map(id => this.http.get<any>(`${this.apiForVideo}/training/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching video for ID ${id}:`, error);
        return of(null); // Return null on error for each ID
      })
    ));
    return forkJoin(requests);
  }
  
  getInductionVideosByIds(ids: string[]): Observable<any[]> {
    const requests = ids.map(id => this.http.get<any>(`${this.apiForVideo}/induction/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching video for ID ${id}:`, error);
        return of(null); // Return null on error for each ID
      })
    ));
    return forkJoin(requests);
  }
}

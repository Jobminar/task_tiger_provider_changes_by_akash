import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  private socket: Socket | null = null;
  private socketConnected$ = new BehaviorSubject<boolean>(false);

  private readonly SOCKET_SERVER_URL = 'https://appsvc-apibackend-dev.azurewebsites.net';
  private readonly api='https://appsvc-apibackend-dev.azurewebsites.net/chats';

  constructor( private http:HttpClient){

  }
  connect(senderId: string, receiverId: string) {
    this.socket = io(this.SOCKET_SERVER_URL);
    
    // Join the chat room
    this.socket.emit('joinRoom', { senderId, receiverId });
    
    // Connection event
    this.socket.on('connect', () => {
      this.socketConnected$.next(true);
    });
    this.socket.on('disconnect', () => {
      this.socketConnected$.next(false);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(messageObj: any, callback: (response: any) => void) {
    this.socket?.emit('sendMessage', messageObj, callback);
  }

  onMessageReceived(callback: (message: any) => void) {
    this.socket?.on('receiveMessage', callback);
  }

  isConnected(): boolean {
    return this.socketConnected$.value;
  }

  getChatHistory(senderId: string, receiverId: string): Observable<any> {
    const params = new HttpParams()
    .set('userId', senderId)
    .set('providerId', receiverId);

    return this.http.get(this.api, { params });
  }
}



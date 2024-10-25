import { Component, ElementRef, ViewChild } from '@angular/core';
import { SocketsService } from '../../sockets.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {

  @ViewChild('chatBox') chatBox: ElementRef | undefined;

  senderId:any = localStorage.getItem('providerId'); // Example senderId (User)
  receiverId = '6645efc4aa91d8147cf3cc47'; // Example receiverId (Admin)
  senderType = 'user';
  receiverType = 'admin';
  messageInput = '';
  messages: any[] = [];
  roomId: string | null = null;
  botId = 'BOT123'; // Example Bot ID
  role:string | null =null;
  constructor(private socketService: SocketsService,
              private routerParam:ActivatedRoute,
              private readonly location:Location
  ) {}

  ngOnInit(): void {
    // Connect to the socket server
    this.getRole();
    this.socketService.connect(this.senderId, this.receiverId);
    this.getChatHistory();
    // Listen for new messages
    this.socketService.onMessageReceived((chatMessage) => {
      console.log(chatMessage);
      this.messages.push(chatMessage);
      this.scrollToBottom();
    });
  }
/* 
  ->getting the param which is added in landing chat page to determine with whom to initiate the chat 

*/

  getRole(){
    this.routerParam.queryParams.subscribe(
      (res)=>{
      
        console.log(res);
        const role=res['role'];
        const id=res['id']
        if (role==='user') {
          this.receiverId=id;
        }
        console.log(role, id);
        console.log(this.role);
      }
    )
  }
  sendMessage(): void {
    if (this.messageInput.trim()) {
      const message = {
        senderId: this.senderId,
        receiverId: this.receiverId,
        message: this.messageInput,
        senderType: this.senderType,
        receiverType: this.receiverType,
      };

      this.socketService.sendMessage(message, (response) => {
        if (response.status === 'ok') {
          console.log('Message sent successfully');
        } else {
          console.error('Failed to send message:', response.message);
        }
      });

      this.messages.push({ sender: 'user', content: this.messageInput });
      this.messageInput = '';
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }

  goBack(): void {
    // Add your back navigation logic here
    this.location.back();
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }


  getChatHistory(): void {
    this.socketService.getChatHistory(this.senderId, this.receiverId).subscribe(
      (chatHistory) => {
        this.messages = chatHistory;
        this.scrollToBottom();
      },
      (error) => {
        console.error('Error fetching chat history:', error);
      }
    );
  }
}



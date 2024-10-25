import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chatbotlanding',
  templateUrl: './chatbotlanding.component.html',
  styleUrl: './chatbotlanding.component.css'
})
export class ChatbotlandingComponent {
  private role:string | null=null;
  constructor(private router: Router,private routerParam:ActivatedRoute) {}

  ngOnInit(): void {
    this.getParam();
    // Redirect to another page after 5 seconds
    const role={
      role:this.role,
      id:''
    }
    setTimeout(() => {
      this.router.navigate(['/help/chatbot'],{queryParams:role});  // Change 'home' to your desired route
    }, 5000);
  }

  // getting the params from router to define with whom does proider want to connect
  getParam(){
    this.routerParam.paramMap.subscribe(
      (res)=> {
        this.role=res.get('role');
        console.log(res);
        console.log(this.role);
      }
    )
  }
}

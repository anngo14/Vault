import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { notification } from './models/notification';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = "Vault";
  notifications: notification[] = [ 
    {
      account: "Account Name",
      website: "Website"
    }
];

  constructor(private r: Router) {}

  redirectToLogin(){
    this.r.navigate(['/login']);
  }
  redirectToHome(){
    this.r.navigate(['/home']);
  }
  redirectToGenerator(){
    this.r.navigate(['/generator']);
  }
  clearAllNotifications(){
    this.notifications = [];
  }
}

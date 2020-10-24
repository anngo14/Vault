import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { notifications } from './models/notifications';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = "Vault";
  notifications: notifications[] = [
    {
      label: "Website",
      account: 
      {
        user: "Account",
        pwd: "password",
        strength: 120,
        showPwd: false,
        notify: true,
        created: "October 1, 2020",
        refresh: true,
        interval: 30,
        history: [
          {
            date: "October 10, 2020",
            pwd: "password"
          },
          {
            date: "October 5, 2020",
            pwd: "test"
          },
          {
            date: "October 1, 2020",
            pwd: "pwd"
          }
        ]
      }
    }, 
    {
      label: "Gmail",
      account: 
      {
        user: "user",
        pwd: "test",
        strength: 120,
        showPwd: false,
        notify: true,
        created: "October 5, 2020",
        refresh: true,
        interval: 30,
        history: [
          {
            date: "October 7, 2020",
            pwd: "test"
          },
          {
            date: "October 5, 2020",
            pwd: "pwd"
          }
        ]
      }
    }
  ];

  constructor(public dialog: MatDialog, private r: Router, public u: UserService) {}

  redirectToLogin(){
    this.r.navigate(['/login']);
  }
  redirectToHome(){
    this.r.navigate(['/home']);
  }
  redirectToGenerator(){
    this.r.navigate(['/generator']);
  }
  redirectToSettings(){
    this.r.navigate(['/settings']);
  }
  redirectToRegister(){
    this.r.navigate(['/register']);
  }
  clearAllNotifications(){
    this.notifications = [];
  }
  ignore(n: notifications){
    this.closeNotification(n);
  }
  refresh(n: notifications){
    this.closeNotification(n);
  }
  closeNotification(n: notifications){
    let index = this.notifications.indexOf(n);
    this.notifications.splice(index, 1);
  }
  logout(){
    this.u.logout();
  }
}

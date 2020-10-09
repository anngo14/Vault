import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = "Vault";
  notifications: number = 3;
  badgeVisibility: boolean = true;
  notify: boolean = true;

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
    this.notifications = 0;
    this.badgeVisibility = false;
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DetailedComponent } from './detailed/detailed.component';
import { account } from './models/account';
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

  constructor(public dialog: MatDialog, private r: Router) {}

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
  clearAllNotifications(){
    this.notifications = [];
  }
  openDetailed(a: account){
    const detailedRef = this.dialog.open(DetailedComponent, {
      data: a
    });
  }
}

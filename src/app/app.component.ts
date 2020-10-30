import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { account } from './models/account';
import { notifications } from './models/notifications';
import { AccountService } from './services/account.service';
import { PasswordService } from './services/password.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = "Vault";
  notifications: notifications[] = [];
  rnotifications: notifications[] = [];
  email: string = "";
  today: string = "";
  todayF: string = "";
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(public dialog: MatDialog, private r: Router, public u: UserService, private p: PasswordService, private a: AccountService) {
    let d = new Date();
    this.today = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear();
    this.todayF = this.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    if(u.loggedIn()){
      this.email = localStorage.getItem('email');
      this.getNotifications();
      setInterval(() => {
        let d = new Date();
        let time = d.getHours() + ":" + d.getMinutes();
        if(time === "0:0"){
          this.notifications = [];
          this.rnotifications = [];
          this.getNotifications();
        }
      }, 60000);
    }
  }

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
    for(let i = 0; i < this.notifications.length; i++){
      this.closeNotification(this.notifications[i], 0);
    }
    for(let i = 0; i < this.rnotifications.length; i++){
      this.closeNotification(this.rnotifications[i], 0);
    }
    this.notifications = [];
    this.rnotifications = [];
  }
  ignore(n: notifications){
    this.closeNotification(n, 0);
  }
  refresh(n: notifications){
    let old = n.account.pwd;
    n.account.pwd = this.p.refreshPassword(n.account.pwd);
    n.account.strength = this.p.calculateEntropy(n.account.pwd);
    n.account.history.unshift({date: this.todayF, pwd: old});
    this.closeNotification(n, 0);
  }
  refreshWithoutClose(n: notifications){
    let old = n.account.pwd;
    n.account.pwd = this.p.refreshPassword(n.account.pwd);
    n.account.strength = this.p.calculateEntropy(n.account.pwd);
    n.account.history.unshift({date: this.todayF, pwd: old});
    this.a.updateAccount(this.email, n.password.category, n.password.label, n.password.accounts).subscribe(data => {
      console.log(data);
    });
  }
  closeNotification(n: notifications, t: number){
    n.account.lastUpdate = this.today;
    this.a.updateAccount(this.email, n.password.category, n.password.label, n.password.accounts).subscribe(data => {
      console.log(data);
    });
    let index;
    if(t === 0){
      index = this.notifications.indexOf(n);
      this.notifications.splice(index, 1);
    } else{
      index = this.rnotifications.indexOf(n);
      this.rnotifications.splice(index, 1);
    }
  }
  getNotifications(){
    this.p.getPersonal(this.email).subscribe(data => {
      let pA = data.result.personalArray;
      for(let i = 0; i < pA.length; i++){
        for(let j = 0; j < pA[i].accounts.length; j++){
          if(pA[i].accounts[j].notify === true && pA[i].accounts[j].refresh === false && this.diffDate(pA[i].accounts[j], this.today)){
            this.notifications.push({password: pA[i], account: pA[i].accounts[j]});
          } else if(pA[i].accounts[j].notify === true && pA[i].accounts[j].refresh === true && this.diffDate(pA[i].accounts[j], this.today)){
            let n = {password: pA[i], account: pA[i].accounts[j]};
            this.rnotifications.push(n);
            if(this.diffDateF(n.account, this.today)){
              this.refreshWithoutClose(n);
            }
          }
        }
      }
    });
    this.p.getSecret(this.email).subscribe(data => {
      let sA = data.result.secretArray;
      for(let i = 0; i < sA.length; i++){
        for(let j = 0; j < sA[i].accounts.length; j++){
          if(sA[i].accounts[j].notify === true && sA[i].accounts[j].refresh === false && this.diffDate(sA[i].accounts[j], this.today)){
            this.notifications.push({password: sA[i], account: sA[i].accounts[j]});
          } else if(sA[i].accounts[j].notify === true && sA[i].accounts[j].refresh === true && this.diffDate(sA[i].accounts[j], this.today)){
            let n = {password: sA[i], account: sA[i].accounts[j]};
            this.rnotifications.push(n);
            if(this.diffDateF(n.account, this.today)){
              this.refreshWithoutClose(n);
            }
          }
        }
      }
    });
    this.p.getOther(this.email).subscribe(data => {
      let oA = data.result.otherArray;
      for(let i = 0; i < oA.length; i++){
        for(let j = 0; j < oA[i].accounts.length; j++){
          if(oA[i].accounts[j].notify === true && oA[i].accounts[j].refresh === false && this.diffDate(oA[i].accounts[j], this.today)){
            this.notifications.push({password: oA[i], account: oA[i].accounts[j]});
          } else if(oA[i].accounts[j].notify === true && oA[i].accounts[j].refresh === true && this.diffDate(oA[i].accounts[j], this.today)){
            let n = {password: oA[i], account: oA[i].accounts[j]};
            this.rnotifications.push(n);
            if(this.diffDateF(n.account, this.today)){
              this.refreshWithoutClose(n);
            }
          }
        }
      }
    })
  }
  diffDate(a: account, d2: string): boolean{
    let d1 = a.lastUpdate;
    let diff = a.interval;
    let count = 0;
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    count = Math.abs(date2.getTime() - date1.getTime());
    count = count / (1000 * 3600 * 24);
    return count >= diff;
  }
  diffDateF(a: account, d2: string): boolean{
    let d1 = a.history[0].date;
    if(d1 === null) d1 = a.created;
    let diff = a.interval;
    let count = 0;
    d1 = this.formatDate(d1);
    let date1 = new Date(d1);
    let date2 = new Date(d2);

    count = Math.abs(date2.getTime() - date1.getTime());
    count = count / (1000 * 3600 * 24);
    return count >= diff;
  }
  formatDate(d: string){
    let s = d.split(" ");
    let month = this.months.indexOf(s[0]);
    let day = s[1];
    day = day.substring(0, day.length - 1);
    let year = s[2];
    return month + "-" + day + "-" + year;
  }
  logout(){
    this.u.logout();
  }
}

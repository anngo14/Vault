import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { AddAccountComponent } from '../add-account/add-account.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DetailedComponent } from '../detailed/detailed.component';
import { EditComponent } from '../edit/edit.component';
import { account } from '../models/account';
import { notifications } from '../models/notifications';
import { password } from '../models/password';
import { AccountService } from '../services/account.service';
import { DataService } from '../services/data.service';
import { PasswordService } from '../services/password.service';
import { UnlockComponent } from '../unlock/unlock.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  email: string = "";
  showPwd: boolean = false;
  pwd: string = "test";
  personalLock: boolean = true;
  secretLock: boolean = true;
  otherLock: boolean = true;
  today: string = "";
  todayf: string = "";

  personal: password[] = [];
  secret: password[] = [];
  other: password[] = [];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  notification: notifications = null;
  personalBuffer: boolean;
  secretBuffer: boolean;
  otherBuffer: boolean;

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private cb: ClipboardService, private p: PasswordService, private a: AccountService, private r: Router, private ds: DataService) { 
    let d = new Date();
    this.today = this.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    this.todayf = (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getFullYear();
    this.ds.setP(true);
    this.ds.setO(true);
    this.ds.setS(true);
  }

  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.ds.new_notify.subscribe(data => {
      this.notification = data;
      if(this.notification !== null) this.updateNotification(this.notification);
    });
    this.p.getPersonal(this.email).subscribe(data => {
      this.personal = data.result.personalArray;
      this.ds.setP(false);
    });
    this.p.getSecret(this.email).subscribe(data => {
      this.secret = data.result.secretArray;
      this.ds.setS(false);
    });
    this.p.getOther(this.email).subscribe(data => {
      this.other = data.result.otherArray;
      this.ds.setO(false);
    });

    this.ds.p.subscribe(data => {
      this.personalBuffer = data;
    });
    this.ds.s.subscribe(data => {
      this.secretBuffer = data;
    });
    this.ds.o.subscribe(data => {
      this.otherBuffer = data;
    })
  }
  unlockCategory(c: string){
    const unlockDialogRef = this.dialog.open(UnlockComponent, {
      data: { category: c}
    });
    unlockDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.toggleCategory(c);
      }
    });
  }
  openDetailed(p: password, a: account){
    let account: account = {
      user: a.user,
      pwd: a.pwd,
      strength: a.strength,
      showPwd: false,
      notify: a.notify,
      lastUpdate: a.lastUpdate,
      created: a.created,
      refresh: a.refresh,
      interval: a.interval,
      history: a.history
    };
    const detailedDialogRef = this.dialog.open(DetailedComponent, {
      data: {account: account, pwd: p, original: a}
    });
    detailedDialogRef.afterClosed().subscribe(result => {
      if(result){
        if(account.pwd !== a.pwd){
          while(account.history.length >= 10){
            account.history.splice(account.history.length - 1, 1);
          }
          account.history.unshift({date: this.today, pwd: a.pwd});
        } 
        account.lastUpdate = this.todayf;
        this.updateAccount(p, a, account);
        this.a.updateAccount(this.email, p.category, p.label, p.accounts).subscribe(data => {
          console.log(data);
        },
        err => {
          if(err instanceof HttpErrorResponse){
            this.r.navigate(['/error']);
          }
        });
      }
    });
  }
  updateAccount(password: password, original: account, update: account){
    let index = password.accounts.indexOf(original);
    password.accounts[index] = update;
    password.accounts[index].showPwd = false;
  }
  openAccount(p: password){
    let newAccount: account = {
      user: "",
      pwd: "",
      strength: -1,
      showPwd: false,
      notify: true,
      lastUpdate: this.todayf,
      created: this.today,
      refresh: false,
      interval: 30,
      history: []
    };
    const accountDialogRef = this.dialog.open(AddAccountComponent, {
      data: {newAccount: newAccount, pwd: p}
    });
    accountDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.a.addAccount(this.email, p.category, p.label, newAccount).subscribe(data => {
          if(data.status === 200){
            p.accounts.push(newAccount);
          }
        }, 
        err => {
          if(err instanceof HttpErrorResponse){
            this.r.navigate(['/error']);
          }
        });
      }
    });
  }
  toggleCategory(c: string){
    if(c === "Personal"){
      this.personalLock = !this.personalLock;
    } else if(c === "Secret"){
      this.secretLock = !this.secretLock;
    } else{
      this.otherLock = !this.otherLock;
    }
  }
  toggleShow(a: account){
    a.showPwd = !a.showPwd;
  }
  copyToClipboard(a: account){
    this.cb.copyFromContent(a.pwd);
    this.openSnackbar();
  }
  openLink(url){
    window.open(url);
  }
  openSnackbar(){
    this.snackBar.open("Copied to Clipboard", null, {
      duration: 1000
    });
  }
  openConfirm(p: password, a: account){
    const confirmRef = this.dialog.open(ConfirmComponent);
    confirmRef.afterClosed().subscribe(result => {
      if(result){
        let index = this.getPasswordIndex(p.category, p);
        this.a.removeAccount(this.email, p.category, p.label, a.user).subscribe(data => {
          if(data.status === 200){
            let ai = p.accounts.indexOf(a);
            p.accounts.splice(ai, 1);
            if(p.accounts.length === 0){
              this.deletePassword(index, p.category);
              this.p.delete(this.email, p.category, p.label).subscribe(data => {
              },
              err => {
                if(err instanceof HttpErrorResponse){
                  this.r.navigate(['/error']);
                }
              });
            }
          }
        },
        err => {
          if(err instanceof HttpErrorResponse){
            this.r.navigate(['/error']);
          }
        });
      }
    });
  }
  getPasswordIndex(c: number, p: password): number{
    let index;
    if(c == 0){
      index = this.personal.indexOf(p);
    } else if(c == 1){
      index = this.secret.indexOf(p);
    } else{
      index = this.other.indexOf(p);
    }
    return index;
  }
  deletePassword(i: number, c: number){
    if(c == 0){
      this.personal.splice(i, 1);
    } else if(c == 1){
      this.secret.splice(i, 1);
    } else{
      this.other.splice(i, 1);
    }
  }
  updateNotification(n: notifications){
    let index = -1;
    let account_index = -1;
    switch(n.password.category){  
      case 0:
        index = this.findPassword(this.personal, n.password);
        account_index = this.findAccount(this.personal[index].accounts, n.account);
        this.personal[index].accounts[account_index] = n.account;
        break;
      case 1:
        index = this.findPassword(this.secret, n.password);
        account_index = this.findAccount(this.secret[index].accounts, n.account);
        this.secret[index].accounts[account_index] = n.account;
        break;
      case 2:
        index = this.findPassword(this.other, n.password);
        account_index = this.findAccount(this.other[index].accounts, n.account);
        this.other[index].accounts[account_index] = n.account;
        break;
    }
  }
  findPassword(a: password[], p: password):number {
    for(let i = 0; i < a.length; i++){
      if(a[i].label === p.label) return i;
    }
    return -1;
  }
  findAccount(a: account[], account: account):number {
    for(let i = 0; i < a.length; i++){
      if(a[i].user === account.user) return i;
    }
    return -1;
  }
  redirectToGenerator(){
    this.r.navigate(['/generator']);
  }
  openEditPassword(p: password){
    let pwd: password = {
      category: p.category,
      label: p.label,
      website: p.website,
      accounts: p.accounts
    };
    let array = (p.category === 0) ? this.personal : (p.category === 1) ? this.secret : this.other;
    let index = this.getPasswordIndex(p.category, p);
    const editDialog = this.dialog.open(EditComponent, {
      data: { 
        password: pwd,
        index: index,
        array: array
       }
    });
    editDialog.afterClosed().subscribe(result => {
      if(result && pwd !== p){
        p.label = pwd.label;
        p.website = pwd.website;
        this.p.updatePwd(localStorage.getItem("email"), p.category, array).subscribe(data => {
          console.log(data);
        });
      }
    });
  }
}

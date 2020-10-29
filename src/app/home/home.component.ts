import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { AddAccountComponent } from '../add-account/add-account.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DetailedComponent } from '../detailed/detailed.component';
import { account } from '../models/account';
import { password } from '../models/password';
import { AccountService } from '../services/account.service';
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

  personal: password[] = [];
  secret: password[] = [];
  other: password[] = [];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private cb: ClipboardService, private p: PasswordService, private a: AccountService) { 
    let d = new Date();
    this.today = this.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.p.getPersonal(this.email).subscribe(data => {
      this.personal = data.result.personalArray;
    })
    this.p.getSecret(this.email).subscribe(data => {
      this.secret = data.result.secretArray;
    })
    this.p.getOther(this.email).subscribe(data => {
      this.other = data.result.otherArray;
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
      created: a.created,
      refresh: a.refresh,
      interval: a.interval,
      history: a.history
    };
    const detailedDialogRef = this.dialog.open(DetailedComponent, {
      data: account
    });
    detailedDialogRef.afterClosed().subscribe(result => {
      if(result && !this.checkOneExistingUser(p, account.user, p.accounts.indexOf(a))){
        if(account.pwd !== a.pwd){
          account.history.unshift({date: this.today, pwd: a.pwd});
        } 
        this.updateAccount(p, a, account);
        this.a.updateAccount(this.email, p.category, p.label, p.accounts).subscribe(data => {
          console.log(data);
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
      created: "",
      refresh: false,
      interval: 30,
      history: []
    };
    const accountDialogRef = this.dialog.open(AddAccountComponent, {
      data: newAccount
    });
    accountDialogRef.afterClosed().subscribe(result => {
      if(result && !this.checkExistingUser(p, newAccount.user)){
        this.a.addAccount(this.email, p.category, p.label, newAccount).subscribe(data => {
          if(data.status === 200){
            p.accounts.push(newAccount);
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
              });
            }
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
  checkExistingUser(p: password, u: string){
    for(let i = 0; i < p.accounts.length; i++){
      if(p.accounts[i].user === u) return true;
    }
    return false;
  }
  checkOneExistingUser(p: password, u: string, index: number){
    let count = 0;
    for(let i = 0; i < p.accounts.length; i++){
      if(p.accounts[i].user === u && i != index) return true;
    }
    return false;
  }
}

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

  personal: password[] = [];
  secret: password[] = [];
  other: password[] = [];
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private cb: ClipboardService, private p: PasswordService, private a: AccountService) { }

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
      if(result){
        if(account.pwd !== a.pwd){

        } else{
          
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
      refresh: true,
      interval: null,
      history: []
    };
    const accountDialogRef = this.dialog.open(AddAccountComponent, {
      data: newAccount
    });
    accountDialogRef.afterClosed().subscribe(result => {
      if(result){
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
        this.a.removeAccount(this.email, p.category, p.label, a.user).subscribe(data => {
          if(data.status === 200){
            let index = p.accounts.indexOf(a);
            p.accounts.splice(index, 1);
          }
        });
      }
    });
  }
}

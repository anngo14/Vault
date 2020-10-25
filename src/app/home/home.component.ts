import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { AddAccountComponent } from '../add-account/add-account.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DetailedComponent } from '../detailed/detailed.component';
import { account } from '../models/account';
import { password } from '../models/password';
import { PasswordService } from '../services/password.service';
import { UnlockComponent } from '../unlock/unlock.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showPwd: boolean = false;
  pwd: string = "test";
  personalLock: boolean = true;
  secretLock: boolean = true;
  otherLock: boolean = true;

  personal: password[] = [];
  secret: password[] = [];
  other: password[] = [];
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private cb: ClipboardService, private p: PasswordService) { }

  ngOnInit() {
    let email = localStorage.getItem('email');
    this.p.getPersonal(email).subscribe(data => {
      this.personal = data.result.personalArray;
    })
    this.p.getSecret(email).subscribe(data => {
      this.secret = data.result.secretArray;
    })
    this.p.getOther(email).subscribe(data => {
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
  openDetailed(a: account){
    const detailedDialogRef = this.dialog.open(DetailedComponent, {
      data: a
    });
    detailedDialogRef.afterClosed().subscribe(result => {
  
    });
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
        p.accounts.push(newAccount);
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
        let index = p.accounts.indexOf(a);
        p.accounts.splice(index, 1);
      }
    });
  }
}

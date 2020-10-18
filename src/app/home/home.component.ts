import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { AddAccountComponent } from '../add-account/add-account.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DetailedComponent } from '../detailed/detailed.component';
import { account } from '../models/account';
import { password } from '../models/password';
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

  personalTest: password[] = [
    {
      category: 0,
      label: "Website",
      website: "https://www.google.com",
      accounts: [
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
      ]
    }
  ];
  secretTest: password[] = [
    {
      category: 0,
      label: "Gmail",
      website: "https://www.gmail.com",
      accounts: [
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
      ]
    }
  ];
  otherTest: password[] = [
    {
      category: 0,
      label: "YouTube",
      website: "https://www.youtube.com",
      accounts: [
        {
          user: "username",
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
      ]
    }
  ];
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private cb: ClipboardService) { }

  ngOnInit() {
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

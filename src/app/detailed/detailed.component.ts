import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { account } from '../models/account';
import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css']
})
export class DetailedComponent implements OnInit {

  textAttribute: string = "password";
  strength: string = "N/A";
  account: account;

  constructor(public detailedRef: MatDialogRef<DetailedComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, private cb: ClipboardService, private p: PasswordService) { 
    this.account = this.data;
    this.calculateEntropy();
  }

  ngOnInit() {
  }

  toggleNotify(){
    this.account.notify = !this.account.notify
  }
  toggleShow(){
    this.account.showPwd = !this.account.showPwd;
    if(this.account.showPwd){
      this.textAttribute = "text";
    } else{
      this.textAttribute = "password";
    }
  }
  copyToClipboard(){
    this.cb.copyFromContent(this.account.pwd);
    this.openSnackbar("Copied to Clipboard");
  }
  openSnackbar(msg: string){
    this.snackBar.open(msg, null, {
      duration: 1000
    });
  }
  refreshPassword(){
    this.p.refreshPassword(this.account.pwd);
    this.calculateEntropy();
    this.openSnackbar("Password Refreshed");
  }
  calculateEntropy(){
    let entropy = this.p.calculateEntropy(this.account.pwd);
    if(entropy <= 35){
      this.strength = "Weak";
    } else if(entropy > 35 && entropy <= 59){
      this.strength = "Fair";
    } else{
      this.strength = "Strong";
    }
  }
  cancel(){
    this.detailedRef.close(false);
  }
  save(){
    this.detailedRef.close(true);
  }
}

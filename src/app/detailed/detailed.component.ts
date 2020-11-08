import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { account } from '../models/account';
import { password } from '../models/password';
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
  error: boolean = false;
  errorMsg: string = "Existing Account with the same Username was found! Account Users for the same Password must be Unique. Please Try Again!";

  constructor(public detailedRef: MatDialogRef<DetailedComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, private cb: ClipboardService, private p: PasswordService) { 
    this.account = this.data.account;
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
    this.account.pwd = this.p.refreshPassword(this.account.pwd);
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
    if(this.checkOneExistingUser(this.data.pwd, this.account.user, this.data.pwd.accounts.indexOf(this.data.original))){
      this.error = true;
      return;
    }
    this.detailedRef.close(true);
  }
  verify(){
    if(this.account.user.length > 0 && this.account.pwd.length > 0 && this.account.interval > 0){ 
      return true;
    }
    return false;
  }
  checkOneExistingUser(p: password, u: string, index: number){
    for(let i = 0; i < p.accounts.length; i++){
      if(p.accounts[i].user === u && i != index) return true;
    }
    return false;
  }
}

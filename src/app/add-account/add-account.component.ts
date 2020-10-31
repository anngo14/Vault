import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { account } from '../models/account';
import { password } from '../models/password';
import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  length: number;
  lengths: number[] = [];
  Alpha: boolean = false;
  Numerical: boolean = false;
  Special: boolean = false;
  today: string = "";
  strength: string = "N/A";
  account: account;
  error: boolean = false;
  errorMsg: string = "Existing Account with the same Username was found! Account Users for the same Password must be Unique. Please Try Again!";

  constructor(public accountRef: MatDialogRef<AddAccountComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private p: PasswordService) { 
    this.account = this.data.newAccount;
    this.today = this.account.created;

    for(let i = 3; i < 45; i++){
      this.lengths.push(i + 1);
    }
  }

  ngOnInit() {
  }
  toggleNotify(){
    this.account.notify = !this.account.notify;
  }
  generatePassword(){
    this.account.pwd = this.p.generatePassword(this.Alpha, this.Numerical, this.Special, this.length);
    this.calculateEntropy();
  }
  calculateEntropy(): number{
    let entropy = this.p.calculateEntropy(this.account.pwd);
    if(entropy <= 35){
      this.strength = "Weak";
    } else if(entropy > 35 && entropy <= 59){
      this.strength = "Fair";
    } else{
      this.strength = "Strong";
    }
    return entropy;
  }
  verify(){
    if(this.account.user.length > 0 && this.account.pwd.length > 0 && this.account.interval > 0){ 
      return true;
    }
    return false;
  }
  cancel(){
    this.accountRef.close(false);
  }
  save(){
    this.account.strength = this.calculateEntropy();
    if(this.checkExistingUser(this.data.pwd, this.account.user)){
      this.error = true;
      this.account.user = "";
      this.account.pwd = "";
      this.strength = "N/A";
      return;
    }
    this.accountRef.close(true);
  }
  checkExistingUser(p: password, u: string){
    for(let i = 0; i < p.accounts.length; i++){
      if(p.accounts[i].user === u) return true;
    }
    return false;
  }
}

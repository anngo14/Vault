import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css']
})
export class DetailedComponent implements OnInit {

  showPwd: boolean = false;
  textAttribute: string = "password";
  username: string = "";
  pwd: string = "";
  refresh: boolean = true;
  notify: boolean = true;
  today: string = "";
  strength: string = "N/A";
  alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  alphaUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  numerical = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  special = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '~', '<', '>', ',', '.', '/', '?', ':', ';'];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(public detailedRef: MatDialogRef<DetailedComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar, private cb: ClipboardService) { 
    let d = new Date();
    this.today = this.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  ngOnInit() {
  }

  toggleNotify(){
    this.notify = !this.notify;
  }
  toggleShow(){
    this.showPwd = !this.showPwd;
    if(this.showPwd){
      this.textAttribute = "text";
    } else{
      this.textAttribute = "password";
    }
  }
  copyToClipboard(){
    this.cb.copyFromContent(this.pwd);
    this.openSnackbar("Copied to Clipboard");
  }
  openSnackbar(msg: string){
    this.snackBar.open(msg, null, {
      duration: 1000
    });
  }
  refreshPassword(){
    let containsLower = false;
    let containsUpper = false;
    let containsNum = false;
    let containsSpecial = false;
    let length = this.pwd.length;
    let available = [];
    
    for(let i = 0; i < this.pwd.length; i++){
      let c = this.pwd.charAt(i);
      if(this.alpha.includes(c)) containsLower = true;
      if(this.alphaUpper.includes(c)) containsUpper = true;
      if(this.numerical.includes(c)) containsNum = true;
      if(this.special.includes(c)) containsSpecial = true;
    }

    if(containsLower) available = available.concat(this.alpha);
    if(containsUpper) available = available.concat(this.alphaUpper);
    if(containsNum) available = available.concat(this.numerical);
    if(containsSpecial) available = available.concat(this.special);

    this.pwd = "";
    for(let i = 0; i < length; i++){
      let randomIndex = Math.floor(Math.random() * (available.length - 1));
      this.pwd += available[randomIndex];
    }
    this.calculateEntropy();
    this.openSnackbar("Password Refreshed")
  }
  calculateEntropy(){
    let containsLower = false;
    let containsUpper = false;
    let containsNum = false;
    let containsSpecial = false;
    let unique = 0;
    let entropy = 0;

    for(let i = 0; i < this.pwd.length; i++){
      let c = this.pwd.charAt(i);
      if(this.alpha.includes(c)) containsLower = true;
      if(this.alphaUpper.includes(c)) containsUpper = true;
      if(this.numerical.includes(c)) containsNum = true;
      if(this.special.includes(c)) containsSpecial = true;
    }

    if(containsLower) unique += this.alpha.length;
    if(containsUpper) unique += this.alphaUpper.length;
    if(containsNum) unique += this.numerical.length;
    if(containsSpecial) unique += this.special.length;

    unique = Math.pow(unique, this.pwd.length);
    entropy = Math.log(unique) / Math.log(2);

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
}

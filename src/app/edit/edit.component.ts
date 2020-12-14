import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { password } from '../models/password';
import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  password: password = null;
  error: boolean = false;
  errorMsg: string = "Existing Password with the Same Label Found! Labels must be Unique in each Category! Please Try Again!";
  index: number;
  constructor(public dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private p: PasswordService) { 
    this.password = this.data.password;
    this.index = this.data.index;
  }

  ngOnInit() {
  }

  cancel(){
    this.dialogRef.close(false);
  }
  save(){
    this.formatLink();
    if(this.hasExistingPassword()){
      this.error = true;
      return;
    }
    this.dialogRef.close(true);
  }
  valid(){
    if(this.password.label.length > 0 && this.checkLink()) return true;
    return false;
  }
  checkLink(): boolean{
    if(this.password.website.length === 0 || this.password.website.match(/.+\..+/)){
      return true;
    }
    return false;
  }
  formatLink(){
    if(this.password.website.match(/(http|https):\/\/(www\.)?.+\..+/) || this.password.website.length === 0){
      return;
    } else{
      let header = "https://";
      this.password.website = header + this.password.website;
    }
  }
  hasExistingPassword(): boolean{
    for(let i = 0; i < this.data.array.length; i++){
      if(i === this.index) continue;
      if(this.data.array[i].label === this.password.label) return true;
    }
    return false;
  }
}

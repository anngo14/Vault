import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.component.html',
  styleUrls: ['./unlock.component.css']
})
export class UnlockComponent implements OnInit {

  pass: string = "";
  error: boolean = false;
  errorMsg: string = "Incorrect Password! Please Try Again!";
  constructor(public unlockRef: MatDialogRef<UnlockComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private u: UserService) { }

  ngOnInit() {
  }

  cancel(){
    this.unlockRef.close(false);
  }
  confirm(){
    let email = localStorage.getItem('email');
    this.u.loginuser(email, this.pass).subscribe(data => {
      if(data.token !== undefined){
        this.unlockRef.close(true);
      } else{
        this.error = true;
        this.pass = "";
      }
    });
  }
}

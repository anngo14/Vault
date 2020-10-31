import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmComponent } from '../confirm/confirm.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  oldPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";
  email: string = "";
  error: boolean = false;
  errorMsg: string = "Incorrect Credentials! Please Try Again!";

  constructor(private u: UserService, private snackbar: MatSnackBar, public dialog: MatDialog, private r: Router) { 
    this.email = localStorage.getItem('email');
  }

  ngOnInit() {
  }

  verify(){
    if(this.oldPassword.length > 0 && this.newPassword.length > 0 && this.newPassword === this.confirmPassword){
      return true;
    }
    return false;
  }

  changeMasterPassword(){
    this.u.loginuser(this.email, this.oldPassword).subscribe(data => {
      if(data.token !== undefined){
        this.u.changeMaster(this.email, this.newPassword).subscribe(d => {
          if(d.token !== undefined){
            localStorage.setItem('token', d.token);
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmPassword = "";
            this.error = false;
            this.openSnackbar("Master Password has been Changed")
          }
        });
      } else if(data.status === "Invalid Email" || data.status === "Invalid Password"){
        this.error = true;
      }
    });
  }
  wipeData(){
    const confirmRef = this.dialog.open(ConfirmComponent);
    confirmRef.afterClosed().subscribe(result => {
      if(result){
        this.u.wipeUser(this.email).subscribe(data => {
          if(data.status === 200){
            this.openSnackbar("Vault has been wiped!");
          } else{
            this.openSnackbar("Something Went Wrong! Please Try Again!");
          }
        })
      }
    });
  }
  deleteAccount(){
    const confirmRef = this.dialog.open(ConfirmComponent);
    confirmRef.afterClosed().subscribe(result => {
      if(result){
        this.u.deleteuser(this.email).subscribe(data => {
          localStorage.clear();
          this.r.navigate(['/login']);
        });
      }
    });
  }
  openSnackbar(msg: string){
    this.snackbar.open(msg, null, {
      duration: 1500
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  textAttribute: string = "password";
  textAttribute2: string = "password";
  show: boolean = true;
  show2: boolean = true;
  error: boolean = false;
  errorMsg: string = "Existing Account Found! Please Try Again!";
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  
  constructor(private r: Router, private u: UserService) { }

  ngOnInit() {
    if(this.u.loggedIn()){
      this.redirectToHome();
    }
  }

  toggleShow(){
    this.show = !this.show;
    this.textAttribute = this.show ? "password" : "text";
  }
  toggleShow2(){
    this.show2 = !this.show2;
    this.textAttribute2 = this.show2 ? "password" : "text";
  }
  register(){
    if(!this.validatePwd()){
      this.showError();
      return;
    }
    this.u.checkUser(this.email).subscribe(data => {
      if(data.status === 404){
        this.u.registerUser(this.email, this.password).subscribe(result => {
          if(result.token !== undefined){
            this.redirectToLogin();
          } 
        });
      } else if(data.status === 200){
        this.errorMsg = "Existing Account Found! Please Try Again!";
        this.error = true;
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
      }
    })
  }
  redirectToLogin(){
    this.r.navigate(['/login']);
  }
  redirectToHome(){
    this.r.navigate(['/home']);
  }
  checkEmail(): boolean{
    if(this.email.match(/.+@.+\..+/)) return true;
    return false;
  }
  checkPwd(): boolean{
    if(this.password.length >= 8 && this.password.match(/.*[!@#$%^&*()-_+={}[\]~<>,\./?:;].*/)) return true;
    return false;
  }
  checkMatch(): boolean{
    if(this.password === this.confirmPassword) return true;
    return false;
  }
  validatePwd(){
    if(this.checkEmail() && this.checkPwd() && this.checkMatch()){
      return true;
    } else{
      return false;
    }
  } 
  showError(){
    this.errorMsg = "";
    if(!this.checkEmail()){
      this.errorMsg += "Invalid Email Format! ";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
    } 
    if(!this.checkPwd()){
      this.errorMsg += "Password must be at least 8 Characters and Contain a Special Character! ";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
    } 
    if(!this.checkMatch()){
      this.errorMsg += "Passwords Do Not Match! ";
      this.email = "";
      this.password = "";
      this.confirmPassword = "";
    }
    this.error = true;
  }
}

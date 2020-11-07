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
    this.u.checkUser(this.email).subscribe(data => {
      if(data.status === 404){
        this.u.registerUser(this.email, this.password).subscribe(result => {
          if(result.token !== undefined){
            localStorage.setItem('token', result.token);
            this.redirectToLogin();
          } 
        });
      } else if(data.status === 200){
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
  validatePwd(){
    if(this.password === this.confirmPassword && this.password !== ""){
      return true;
    } else{
      return false;
    }
  } 
}

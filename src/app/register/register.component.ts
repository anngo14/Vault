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
  email: string = "";
  password: string = "";
  confirmPassword: string = "";
  
  constructor(private r: Router, private u: UserService) { }

  ngOnInit() {
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
    this.u.registerUser(this.email, this.password).subscribe(res => {
      if(res.token !== undefined){
        localStorage.setItem('token', res.token);
        this.redirectToLogin();
      }
    });
  }
  redirectToLogin(){
    this.r.navigate(['/login']);
  }
  validatePwd(){
    if(this.password === this.confirmPassword && this.password !== ""){
      return true;
    } else{
      return false;
    }
  } 
}

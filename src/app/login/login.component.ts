import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  textAttribute: string = "password";
  show: boolean = true;
  email: string = "";
  password: string = "";
  error: boolean = false;
  errorMsg: string = "Invalid Credentials! Please Try Again!";

  constructor(private elementRef: ElementRef, private r: Router, private u: UserService, private d: DataService) { }

  ngOnInit() {
  }
  toggleShow(){
    this.show = !this.show;
    this.textAttribute = this.show ? "password" : "text";
  }
  redirectToRegister(){
    this.r.navigate(['/register']);
  }
  login(){
    this.u.loginuser(this.email, this.password).subscribe(data => {
      if(data.token !== undefined){
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', this.email);
        this.redirectToHome();
      } else if(data.status === "Invalid Email" || data.status === "Invalid Password"){
        this.error = true;
        this.email = "";
        this.password = "";
      } 
    });
  }
  redirectToHome(){
    this.r.navigate(['/home']);
  }
}

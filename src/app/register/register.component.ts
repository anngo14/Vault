import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  
  constructor(private r: Router) { }

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
  redirectToLogin(){
    this.r.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';

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
  
  constructor() { }

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
}

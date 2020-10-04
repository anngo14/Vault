import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  textAttribute: string = "password";
  show: boolean = true;
  constructor(private elementRef: ElementRef, private r: Router) { }

  ngOnInit() {
    //this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#202124';
  }
  toggleShow(){
    this.show = !this.show;
    this.textAttribute = this.show ? "password" : "text";
  }
  redirectToRegister(){
    this.r.navigate(['/register']);
  }
}

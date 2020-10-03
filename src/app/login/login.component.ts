import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  textAttribute: string = "password";
  show: boolean = true;
  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    //this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#202124';
  }
  toggleShow(){
    this.show = !this.show;
    this.textAttribute = this.show ? "password" : "text";
  }
}

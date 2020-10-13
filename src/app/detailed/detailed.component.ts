import { ThrowStmt } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.css']
})
export class DetailedComponent implements OnInit {

  showPwd: boolean = false;
  textAttribute: string = "password";
  username: string = "";
  pwd: string = "";
  refresh: boolean = false;
  constructor(public detailedRef: MatDialogRef<DetailedComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  toggleShow(){
    this.showPwd = !this.showPwd;
    if(this.showPwd){
      this.textAttribute = "text";
    } else{
      this.textAttribute = "password";
    }
  }
  copyToClipboard(){
    
  }
}

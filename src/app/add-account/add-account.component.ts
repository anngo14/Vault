import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  length: number;
  lengths: number[] = [];
  Alpha: boolean = false;
  Numerical: boolean = false;
  Special: boolean = false;
  label: string = "";
  pwd: string = "";
  notify: boolean = true;
  interval: string = "";
  today: string = "";
  intervals: string[] = ["-", "Monthly", "Yearly", "Weekly", "Daily"];
  alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  alphaUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  numerical = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  special = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '~', '<', '>', ',', '.', '/', '?', ':', ';'];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(public accountRef: MatDialogRef<AddAccountComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    let d = new Date();
    this.today = this.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

    for(let i = 3; i < 45; i++){
      this.lengths.push(i + 1);
    }
  }

  ngOnInit() {
  }
  toggleNotify(){
    this.notify = !this.notify;
  }
}

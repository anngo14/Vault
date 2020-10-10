import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UnlockComponent } from '../unlock/unlock.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showPwd: boolean = true;
  personalLock: boolean = true;
  secretLock: boolean = true;
  otherLock: boolean = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  unlockCategory(c: string){
    console.log(c);
    const dialogRef = this.dialog.open(UnlockComponent, {
      data: { category: c}
    });


  }
}

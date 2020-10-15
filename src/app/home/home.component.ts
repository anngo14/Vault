import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailedComponent } from '../detailed/detailed.component';
import { UnlockComponent } from '../unlock/unlock.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showPwd: boolean = false;
  personalLock: boolean = true;
  secretLock: boolean = true;
  otherLock: boolean = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  unlockCategory(c: string){
    const unlockDialogRef = this.dialog.open(UnlockComponent, {
      data: { category: c}
    });
    unlockDialogRef.afterClosed().subscribe(result => {
      if(result){
        this.toggleCategory(c);
      }
    });
  }
  openDetailed(){
    const detailedDialogRef = this.dialog.open(DetailedComponent, {
      
    });
    detailedDialogRef.afterClosed().subscribe(result => {
  
    });
  }
  toggleCategory(c: string){
    if(c === "Personal"){
      this.personalLock = !this.personalLock;
    } else if(c === "Secret"){
      this.secretLock = !this.secretLock;
    } else{
      this.otherLock = !this.otherLock;
    }
  }
  toggleShow(){
    this.showPwd = !this.showPwd;
  }
}

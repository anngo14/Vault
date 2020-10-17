import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from 'ngx-clipboard';
import { AddAccountComponent } from '../add-account/add-account.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DetailedComponent } from '../detailed/detailed.component';
import { UnlockComponent } from '../unlock/unlock.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showPwd: boolean = false;
  pwd: string = "test";
  personalLock: boolean = true;
  secretLock: boolean = true;
  otherLock: boolean = true;

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private cb: ClipboardService) { }

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
  openAccount(){
    const accountDialogRef = this.dialog.open(AddAccountComponent, {

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
  copyToClipboard(){
    this.cb.copyFromContent(this.pwd);
    this.openSnackbar();
  }
  openSnackbar(){
    this.snackBar.open("Copied to Clipboard", null, {
      duration: 1000
    });
  }
  openConfirm(){
    const confirmRef = this.dialog.open(ConfirmComponent, {
      
    });
  }
}

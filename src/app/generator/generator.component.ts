import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { password } from '../models/password';
import { PasswordService } from '../services/password.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css']
})
export class GeneratorComponent implements OnInit {

  length: number;
  lengths: number[] = [];
  interval: number;
  category: string = "";
  Alpha: boolean = false;
  Numerical: boolean = false;
  Special: boolean = false;
  notify: boolean = true;
  refresh: boolean = false;
  label: string = "";
  link: string = "";
  user: string = "";
  pwd: string = "";
  today: string = "";
  todayf: string = "";
  strength: string = "";
  pwdTypes: string[] = ["Personal", "Secret", "Other"];  
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(private p: PasswordService, private r: Router) {
    let d = new Date();
    this.today = this.months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
    this.todayf = d.getMonth() + "-" + d.getDate() + "-" + d.getFullYear();
    for(let i = 3; i < 45; i++){
      this.lengths.push(i + 1);
    }
  }

  ngOnInit() {
  }

  toggleNotify(){
    this.notify = !this.notify;
  }
  generatePassword(){
    this.pwd = this.p.generatePassword(this.Alpha, this.Numerical, this.Special, this.length);
    this.calculateEntropy();
  }
  calculateEntropy(){
    let entropy = this.p.calculateEntropy(this.pwd);
    if(entropy <= 35){
      this.strength = "Weak";
    } else if(entropy > 35 && entropy <= 59){
      this.strength = "Fair";
    } else{
      this.strength = "Strong";
    }
    return entropy;
  }
  convertCategory(): number{
    let c = 0;
    if(this.category === "Personal"){
      c = 0;
    } else if(this.category === "Secret"){
      c = 1;
    } else{
      c = 2;
    }
    return c;
  }
  valid(){
    if(this.user.length > 0 && this.pwd.length > 0 && this.label.length > 0 && this.link.length > 0){
      if(this.refresh && this.interval === undefined){
        return false;;
      } 
      return true;
    }
    return false;
  }
  save(){
    let newPwd: password = {
      category: this.convertCategory(), 
      label: this.label,
      website: this.link,
      accounts: [
        {
          user: this.user,
          pwd: this.pwd,
          strength: this.calculateEntropy(),
          showPwd: false, 
          notify: this.notify,
          created: this.today,
          lastUpdate: this.todayf,
          refresh: this.refresh,
          interval: this.interval,
          history: []
        }
      ]
    };
    this.p.checkExisting(localStorage.getItem('email'), newPwd.label, newPwd.category).subscribe(data => {
      console.log(data);
      if(data.status === 404){
        this.p.addPwd(localStorage.getItem('email'), newPwd.category, newPwd).subscribe(res => {
          if(res.status === 200){
            window.location.reload();
          }
        });
      }
    });
  }
}

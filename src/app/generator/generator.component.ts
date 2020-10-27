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
  refresh: boolean = true;
  label: string = "";
  link: string = "";
  user: string = "";
  pwd: string = "";
  today: string = "";
  strength: string = "";
  pwdTypes: string[] = ["Personal", "Secret", "Other"];
  alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  alphaUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  numerical = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  special = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '~', '<', '>', ',', '.', '/', '?', ':', ';'];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(private p: PasswordService, private r: Router) {
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
  generatePassword(){
    this.pwd = "";
    let available = [];
    if(this.Alpha) {
      available = available.concat(this.alpha);
      available = available.concat(this.alphaUpper);
    }
    if(this.Numerical) available = available.concat(this.numerical);
    if(this.Special) available = available.concat(this.special);

    for(let i = 0; i < this.length; i++){
      let randomIndex = Math.floor(Math.random() * (available.length - 1));
      this.pwd += available[randomIndex];
    }
    this.calculateEntropy();
  }
  calculateEntropy(): number{
    let containsLower = false;
    let containsUpper = false;
    let containsNum = false;
    let containsSpecial = false;
    let unique = 0;
    let entropy = 0;

    for(let i = 0; i < this.pwd.length; i++){
      let c = this.pwd.charAt(i);
      if(this.alpha.includes(c)) containsLower = true;
      if(this.alphaUpper.includes(c)) containsUpper = true;
      if(this.numerical.includes(c)) containsNum = true;
      if(this.special.includes(c)) containsSpecial = true;
    }

    if(containsLower) unique += this.alpha.length;
    if(containsUpper) unique += this.alphaUpper.length;
    if(containsNum) unique += this.numerical.length;
    if(containsSpecial) unique += this.special.length;

    unique = Math.pow(unique, this.pwd.length);
    entropy = Math.log(unique) / Math.log(2);

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

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.css']
})
export class GeneratorComponent implements OnInit {

  length: number;
  lengths: number[] = [];
  interval: string = "";
  intervals: string[] = ["-", "Monthly", "Yearly", "Weekly", "Daily", "Custom"];

  constructor() { 
    for(let i = 0; i < 32; i++){
      this.lengths[i] = i + 1;
    }
  }

  ngOnInit() {
  }

}

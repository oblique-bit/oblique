import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigable',
  templateUrl: './navigable.component.html',
  styleUrls: ['./navigable.component.css']
})
export class NavigableComponent implements OnInit {

  scientistsSelection = [];
  scientists = [
    {
      firstname : 'Albert',
      lastname : 'Einstein',
      birthdate : '14.03.1879'
    },
    {
      firstname : 'Isaac',
      lastname : 'Newton',
      birthdate : '04.01.1643'
    },
    {
      firstname : 'Galileo',
      lastname : 'Galilei',
      birthdate : '15.02.1564'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}

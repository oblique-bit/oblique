import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bootstrap-test',
  templateUrl: './bootstrap-test.component.html',
  styleUrls: ['./bootstrap-test.component.css']
})
export class BootstrapTestComponent implements OnInit {

  model = {year:2017, month: 3, day: 2};

  constructor() { }

  ngOnInit() {
  }

}

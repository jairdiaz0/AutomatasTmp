import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  $data:EventEmitter<string>;
  constructor() {
    this.$data = new EventEmitter;
  }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  constructor() {}

  activeTab = 'chats';

  ngOnInit() {}

  segmentChanged(ev: any) {
    this.activeTab = ev.target.value;
  }
}

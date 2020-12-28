import { Component, OnInit } from '@angular/core';

import { BrokerService } from './broker.service';
import { SignalRService } from './signalr.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
    <h2>Cash: {{cash | currency: "USD"}}</h2>

    <app-search></app-search>
    <app-portfolio></app-portfolio>
  `,
  providers: [BrokerService, SignalRService]
})
export class AppComponent implements OnInit {
  title = 'Stock market simulator';
  cash: number;

  constructor(private signalRService: SignalRService) { }

  ngOnInit(): void {
    this.signalRService.cash$.subscribe(cash => this.cash = cash);
    this.signalRService
      .connected$
      .subscribe(connected => {
        if (connected) {
          this.signalRService.getInitialCash();
        }
      })
  }
}

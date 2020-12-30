import { Component, OnInit } from '@angular/core';

import { BrokerService } from './services/broker.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
    <h2>Cash: {{cash | currency: "USD"}}</h2>

    <app-search></app-search>
    <app-portfolio></app-portfolio>
  `,
  providers: [BrokerService]
})
export class AppComponent implements OnInit {
  title = 'Stock market simulator';
  cash: number;

  constructor(private brokerService: BrokerService) { }

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
    this.brokerService
      .connected$
      .subscribe(connected => {
        if (connected) {
          this.brokerService.getInitialCash();
        }
      })
  }
}

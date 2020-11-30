import { Component, OnInit } from '@angular/core';

import { Stock } from './stock';
import { BrokerService } from './broker.service';

@Component({
  selector: 'app-portfolio',
  template: `
    <h2>Portfolio</h2>
    <div *ngFor='let stock of portfolio'>
      <p>
        {{ stock.symbol | uppercase }} : {{ stock.quantity }} shares for {{ stock.cost | currency: "USD" }}
      </p>
    </div>
  `
})
export class PortfolioComponent implements OnInit {
  portfolio: Stock[];

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.brokerService.portfolio$
      .subscribe(portfolio => this.portfolio = portfolio);
  }
}

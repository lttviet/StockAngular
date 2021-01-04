import { Component, OnInit } from '@angular/core';

import { Stock } from './models/stock';
import { BrokerService } from './services/broker.service';
import { QuoteService } from './services/quote.service';

@Component({
  selector: 'app-portfolio',
  template: `
    <h2>Portfolio</h2>
    <div *ngFor='let stock of stocks'>
      <p>
        {{ stock.symbol | uppercase }} : {{ stock.quantity }} shares for {{ stock.cost | currency: "USD" }}
        Current price: {{ stock.current | currency: "USD" }}
      </p>
    </div>
  `
})
export class PortfolioComponent implements OnInit {
  stocks: Stock[];

  constructor(private brokerService: BrokerService, private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.brokerService.stocks$.subscribe(stocks => this.stocks = stocks);
    this.brokerService
      .connected$
      .subscribe(connected => {
        if (connected) {
          this.brokerService.getInitialStocks();
        }
      });
    this.quoteService
      .quote$
      .subscribe(quote => {
        const found = this.stocks.find(stock => stock.symbol === quote.symbol);
        if (found) {
          found.current = quote.price;
        }
      });
  }
}

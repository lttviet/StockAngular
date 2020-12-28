import { Component, OnInit } from '@angular/core';

import { Stock } from './broker.service';
import { SignalRService } from './signalr.service';

@Component({
  selector: 'app-portfolio',
  template: `
    <h2>Portfolio</h2>
    <div *ngFor='let stock of stocks'>
      <p>
        {{ stock.symbol | uppercase }} : {{ stock.quantity }} shares for {{ stock.cost | currency: "USD" }}
      </p>
    </div>
  `
})
export class PortfolioComponent implements OnInit {
  stocks: Stock[];

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.stocks$.subscribe(stocks => this.stocks = stocks);
    this.signalRService
      .connected$
      .subscribe(connected => {
        if (connected) {
          this.signalRService.getInitialStocks();
        }
      })
  }
}

import { Component, OnInit, Input } from '@angular/core';

import { Quote } from './quote.service';
import { BrokerService, Stock } from './broker.service';

@Component({
  selector: 'app-info',
  template: `
    <p>
      {{ quote.symbol | uppercase }}
      - {{ quote.current | currency: "USD" }}
      - {{ quote.timestamp | date: 'long'}}

      <button
        (click)="buy(quote.symbol)"
        [disabled]="cash < quote.current"
      >
        Buy
      </button>

      <button
        (click)="sell(quote.symbol)"
        [disabled]="!canSell(quote.symbol)"
      >
        Sell
      </button>
    </p>
  `
})
export class InfoComponent implements OnInit {
  @Input() quote: Quote;
  cash: number;
  portfolio: Stock[];

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
    this.brokerService.portfolio$.subscribe(portfolio => this.portfolio = portfolio);
  }

  buy(symbol: string): void {
    this.brokerService.buy(symbol.toUpperCase(), this.quote.current, 1);
  }

  sell(symbol: string): void {
    this.brokerService.sell(symbol.toUpperCase(), this.quote.current, 1);
  }

  canSell(symbol: string): boolean {
    if (!this.portfolio) {
      return false;
    }
    
    return this.portfolio
      .find(stock => stock.symbol === symbol.toUpperCase())
      ?.quantity > 0;
  }
}

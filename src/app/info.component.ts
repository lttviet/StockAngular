import { Component, OnInit, Input } from '@angular/core';

import { Quote } from './quote';
import { Stock } from './stock';
import { BrokerService } from './broker.service';

@Component({
  selector: 'app-info',
  template: `
    <p>
      {{ symbol | uppercase }}
      - {{ quote.current | currency: "USD" }}
      - {{ quote.timestamp * 1000 | date: 'long'}}

      <button
        (click)="buy(symbol)"
        [disabled]="cash < quote.current"
      >
        Buy
      </button>

      <button
        (click)="sell(symbol)"
        [disabled]="!canSell(symbol)"
      >
        Sell
      </button>
    </p>
  `
})
export class InfoComponent implements OnInit {
  @Input() symbol: string;
  @Input() quote: Quote;
  cash: number;
  portfolio: Stock[];

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
    this.brokerService.portfolio$.subscribe(portfolio => this.portfolio = portfolio);
  }

  buy(symbol: string): void {
    this.brokerService.buy(symbol, this.quote.current, 1);
  }

  sell(symbol: string): void {
    this.brokerService.sell(symbol, this.quote.current, 1);
  }

  canSell(symbol: string): boolean {
    return this.portfolio
      .find(stock => stock.symbol === symbol)
      ?.quantity > 0;
  }
}

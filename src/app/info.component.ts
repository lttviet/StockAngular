import { Component, OnInit, Input } from '@angular/core';

import { Quote } from './services/quote.service';
import { BrokerService } from './services/broker.service';
import { Stock } from './models/stock';
import { Order } from './models/order';
import { noop } from 'rxjs';

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
  stocks: Stock[];

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
    this.brokerService.stocks$.subscribe(stocks => this.stocks = stocks);
  }

  buy(symbol: string): void {
    const order: Order = {
      symbol: symbol.toUpperCase(),
      price: this.quote.current,
      quantity: 1
    }
    this.brokerService
      .buyStock(order)
      .subscribe(
        noop,
        console.error,
        () => console.log("Bought")
      );
  }

  sell(symbol: string): void {
    const order: Order = {
      symbol: symbol.toUpperCase(),
      price: this.quote.current,
      quantity: 1
    }
    this.brokerService
      .sellStock(order)
      .subscribe(
        noop,
        console.error,
        () => console.log("Sold")
      );
  }

  canSell(symbol: string): boolean {
    if (!this.stocks) {
      return false;
    }
    
    return this.stocks
      .find(stock => stock.symbol === symbol.toUpperCase())
      ?.quantity > 0;
  }
}

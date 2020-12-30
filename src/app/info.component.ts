import { Component, OnInit, Input } from '@angular/core';

import { Quote } from './quote.service';
import { Stock } from './models/stock';
import { SignalRService } from './services/signalr.service';

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

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.cash$.subscribe(cash => this.cash = cash);
    this.signalRService.stocks$.subscribe(stocks => this.stocks = stocks);
  }

  buy(symbol: string): void {
    this.signalRService.buyStock(symbol.toUpperCase(), this.quote.current, 1);
  }

  sell(symbol: string): void {
    this.signalRService.sellStock(symbol.toUpperCase(), this.quote.current, 1);
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

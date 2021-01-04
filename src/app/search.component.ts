import { Component, OnDestroy, OnInit } from '@angular/core';

import { QuoteService } from './services/quote.service';
import { Quote } from './models/quote';

@Component({
  selector: 'app-search',
  template: `
    <input #symbol
      (keyup.enter)="search(symbol.value)"
    >

    <button
      (click)="search(symbol.value)"
    >
      Search
    </button>

    <div *ngIf="quote">
      <app-info [quote]="quote"></app-info>
    </div>
  `,
  providers: [QuoteService]
})
export class SearchComponent implements OnInit, OnDestroy {
  private lastSymbol = ''; 
  quote: Quote;

  constructor(private quoteService: QuoteService) {
  }

  ngOnInit(): void {
    this.quoteService.quote$.subscribe(quote => this.quote = quote);
  }

  ngOnDestroy(): void {
    this.quoteService.stop();
  }

  search(symbol: string): void {
    // TODO error if symbol not found
    symbol = symbol.toUpperCase();
    this.quote = null;

    if (this.lastSymbol !== '' && this.lastSymbol !== symbol) {
      this.quoteService.unsubscribe(symbol);
    }
    this.lastSymbol = symbol;

    this.quoteService.subscribe(symbol);
  }
}

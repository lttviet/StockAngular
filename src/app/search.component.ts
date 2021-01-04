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
  `
})
export class SearchComponent implements OnInit, OnDestroy {
  private symbol = '';
  quote: Quote;

  constructor(private quoteService: QuoteService) {
  }

  ngOnInit(): void {
    this.quoteService.quote$.subscribe(quote => {
      if (quote.symbol === this.symbol) {
        this.quote = quote;
      }
    });
  }

  ngOnDestroy(): void {
    this.quoteService.stop();
  }

  search(symbol: string): void {
    // TODO error if symbol not found
    this.symbol = symbol.toUpperCase();
    this.quote = null;

    // TODO unsubscribe last search
    // Take into account current porfolio?

    this.quoteService.subscribe(this.symbol);
  }
}

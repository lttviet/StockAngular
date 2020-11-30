import { Component } from '@angular/core';

import { Quote } from './quote';
import { QuoteService } from './quote.service';

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
      <app-info [symbol]="symbol.value" [quote]="quote"></app-info>
    </div>
  `,
  providers: [QuoteService]
})
export class SearchComponent {
  quote: Quote;

  constructor(private quoteService: QuoteService) {}

  search(symbol: string): void {
    this.quote = null;

    this.quoteService
      .getQuote(symbol)
      .subscribe(quote => this.quote = quote);
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

import { Quote, QuoteResponse } from './quote';

@Injectable()
export class QuoteService {
  private quoteAPI = 'https://finnhub.io/api/v1/quote';
  private token = '';

  constructor(private http: HttpClient) {}

  getQuote(symbol: string): Observable<Quote> {
    const url = `${this.quoteAPI}?symbol=${symbol}&token=${this.token}`;
    return this.http
      .get<QuoteResponse>(url)
      .pipe(
        map(this.mapResponseToQuote),
        tap((q: Quote) => console.log(q)),
        catchError(this.handleError<Quote>('getQuote', null))
    );
  }

  private mapResponseToQuote(response: QuoteResponse): Quote {
    return {
      current: response.c,
      timestamp: response.t,
    };
  }

  private handleError<T>(
    operation = 'operation',
    result?: T
  ): (error: any) => Observable<T> {
    return (error) => {
      console.error(error);
      return of(result as T);
    };
  }
}
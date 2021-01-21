import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Stock } from '../models/stock';
import { Order } from '../models/order';
import { ErrorService } from "./error.service";

@Injectable({
  providedIn: 'root',
})
export class BrokerService {
  private hubURL = "https://localhost:5001/brokerhub";
  private connection : signalR.HubConnection;
  // TODO don't hard code
  private portfolioId = "1";

  cash$: Subject<number> = new BehaviorSubject<number>(0);
  portfolioValue$: Subject<number> = new BehaviorSubject<number>(0);
  stocks$: Subject<Stock[]> = new BehaviorSubject<Stock[]>([]);
  connected$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.connect();
  }

  private connect(): void {
     this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubURL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on(
      "ReceiveCash",
      (cash: number) => this.cash$.next(cash)
    );

    this.connection.on(
      "ReceivePortfolioValue",
      (value: number) => this.portfolioValue$.next(value)
    )

    this.connection.on(
      "ReceiveStocks",
      (stocks: Stock[]) => this.stocks$.next(stocks)
    );

    this.connection.on(
      "ReceiveMessage",
      (msg: string) => console.log(msg)
    );

    this.connection
      .start()
      .then(() => {
        this.connected$.next(true);
        this.errorService.error$.next(false);
        this.initSubject();
      })
      .catch(() => {
        this.connected$.next(false);
        this.errorService.error$.next(true);
      });

      this.connection.onreconnecting(() => {
        this.connected$.next(false);
        this.errorService.error$.next(true);
      })

      this.connection.onreconnected(() => {
        this.connected$.next(true);
        this.errorService.error$.next(false);
        this.initSubject();
      })
  }

  buyStock(order: Order): Observable<void> {
    const url = `https://localhost:5001/api/portfolio/${this.portfolioId}/stocks/buy`;
    return this.http
      .post<void>(url, order)
      .pipe(
        catchError(this.handleError)
      )
  }

  sellStock(order: Order): Observable<void> {
    const url = `https://localhost:5001/api/portfolio/${this.portfolioId}/stocks/sell`;
    return this.http
      .post<void>(url, order)
      .pipe(
        catchError(this.handleError)
      );

  }

  /**
   * Ask server for current values of cash, portfolio value and stocks.
   * These will be saved into Subject for later usage.
   */
  private initSubject(): void {
    this.connection.send("GetCash", this.portfolioId);
    this.connection.send("GetPortfolioValue", this.portfolioId);
    this.connection.send("GetStocks", this.portfolioId);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

import { Quote } from '../models/quote';
import { ErrorService } from "./error.service";

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  private hubURL = 'https://localhost:5001/quotehub';
  private connection : signalR.HubConnection;

  quote$: Subject<Quote> = new BehaviorSubject<Quote>({} as Quote);
  connected$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private errorService: ErrorService) {
    this.connect();
  }

  private connect(): void {
     this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubURL)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.on(
      "ReceiveQuote",
      (quote: Quote) => this.quote$.next(quote)
    );

    this.connection.on(
      "ReceiveMessage",
      (msg: string) => console.log(msg)
    );

    this.connection
      .start()
      .then(() => {
        this.connected$.next(true);
        this.errorService.error$.next(false)
      })
      .catch(() => {
        this.connected$.next(false);
        this.errorService.error$.next(true);
      });

      this.connection.onreconnecting(err => {
        this.connected$.next(false);
        this.errorService.error$.next(true);
        console.error(err);
      })

      this.connection.onreconnected(() => {
        this.connected$.next(true);
        this.errorService.error$.next(false);
      })
  }

  subscribe(symbol: string): void {
    this.connection.send("Subscribe", symbol);
  }

  unsubscribe(symbol: string): void {
    this.connection.send("Unsubscribe", symbol);
  }

  stop(): void {
    this.connection
      .stop()
      .then(() => this.connected$.next(false));
  }
}

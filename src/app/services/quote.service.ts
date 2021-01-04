import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

import { Quote } from '../models/quote';

@Injectable()
export class QuoteService {
  private hubURL = 'https://localhost:5001/quotehub';
  private connection : signalR.HubConnection;

  quote$: Subject<Quote> = new BehaviorSubject<Quote>(null);
  connected$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
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
      .then(() => this.connected$.next(true))
      .catch(console.error);
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

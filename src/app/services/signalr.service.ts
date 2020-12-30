import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as signalR from '@microsoft/signalr';

import { Stock } from '../models/stock';

// TODO merge signalr.service with broker.service
@Injectable()
export class SignalRService {
  private hubURL = "https://localhost:5001/brokerhub";
  private connection : signalR.HubConnection;
  // TODO don't hard code
  private portfolioId = "1";

  cash$: Subject<number> = new BehaviorSubject<number>(0);
  stocks$: Subject<Stock[]> = new BehaviorSubject<Stock[]>([]);
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
      "ReceiveCash",
      (cash: number) => this.cash$.next(cash)
    );

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
      .then(() => this.connected$.next(true))
      .catch(console.error);
  }

  public getInitialCash(): void {
    this.connection.send("GetCash", this.portfolioId);
  }

  public getInitialStocks(): void {
    this.connection.send("GetStocks", this.portfolioId);
  }

  public buyStock(symbol: string, price: number, quantity: number): void {
    this.connection.send("BuyStock", this.portfolioId, symbol.toUpperCase(), price, quantity);
  }

  public sellStock(symbol: string, price: number, quantity: number): void {
    this.connection.send("SellStock", this.portfolioId, symbol.toUpperCase(), price, quantity);
  }
}
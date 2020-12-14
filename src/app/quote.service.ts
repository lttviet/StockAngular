import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Quote {
  symbol: string,
  current: number;
  timestamp: number;
}

export interface QuoteResponse {
  data: [{
    p: number,
    t: number
  }]
}

const SOCKET = 'wss://ws.finnhub.io?token=';

@Injectable()
export class QuoteService {
  socket$: WebSocketSubject<QuoteResponse | any>;

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(SOCKET);
    }
  }
}
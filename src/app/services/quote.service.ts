import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Quote {
  symbol: string,
  current: number;
  timestamp: number;
}

export interface QuoteResponse {
  type: string,
  data?: [{
    s: string,
    p: number,
    t: number
  }]
}

export interface QuoteRequest {
  type: string,
  symbol: string
}

const SOCKET = '';

@Injectable()
export class QuoteService {
  socket$: WebSocketSubject<QuoteResponse | QuoteRequest>;

  connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(SOCKET);
    }
  }
}
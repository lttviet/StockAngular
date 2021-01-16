import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  error$: Subject<boolean> = new BehaviorSubject<boolean>(false);
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ActionType = 
    'add' |
    'edit' |
    'delete';

export interface Action {
    type: ActionType;
};

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  private actionSource = new Subject<Action>();

  actionEmitted$ = this.actionSource.asObservable();

  emitAction(action: Action): void {
    this.actionSource.next(action);
  }
}
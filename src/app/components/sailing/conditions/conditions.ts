import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AddPortDialogData } from '../../add-port-dialog/add-port-dialog';
import { SailingConditionsCard, SailingConditionsCardData } from '../sailing-conditions-card/sailing-conditions-card';
import { SailingPortService } from '../../../services/sailing-port-service/sailing-port-service';
import { Loader } from '../../loader/loader';
import { Action, ActionsService } from '../../../services/actions-service/actions-service';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { UserService } from '../../../services/user-service/user-service';
import { ActionDockButton } from '../../action-dock-button/action-dock-button';
import { ActionDock } from '../../action-dock/action-dock';
import { EmptyState } from '../../empty-state/empty-state';
import { ToastService } from '../../../services/toast-service/toast-service';

@Component({
  selector: 'jwpaisley-conditions',
  standalone: true,
  imports: [CommonModule, SailingConditionsCard, EmptyState, Loader, ActionDockButton, ActionDock],
  templateUrl: './conditions.html',
  styleUrl: './conditions.scss',
})
export class Conditions implements OnInit, OnDestroy {
  private readonly sailingPortService = inject(SailingPortService);
  private readonly actionsService = inject(ActionsService);
  private readonly dialogService = inject(DialogService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();
  cards: SailingConditionsCardData[] = [];
  isLoading = true;
  hasLoaded = false;
  isUserAdmin = false;

  ngOnInit(): void {
    this.isUserAdmin = this.userService.isUserAdmin();

    this.loadPorts();

    this.actionsService.actionEmitted$.pipe(takeUntil(this.destroy$)).subscribe((action: Action) => {
      if (action.type === 'add') {
        void this.openAddPortDialog();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPorts(): void {
    this.isLoading = true;

    this.sailingPortService.getPorts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (ports) => {
        this.cards = this.sailingPortService.reflect(ports);
        this.isLoading = false;
        this.hasLoaded = true;
      },
      error: () => {
        this.cards = [];
        this.isLoading = false;
        this.hasLoaded = true;
        this.toastService.addToast('failed to load sailing ports. please try again later.', 'error', 'danger');
      },
    });
  }

  private async openAddPortDialog(): Promise<void> {
    if (!this.isUserAdmin) {
      return;
    }

    const result = await this.dialogService.openAddPortDialog<AddPortDialogData>({
      title: 'add sailing port',
      icon: 'directions_boat',
      confirmLabel: 'save port',
      cancelLabel: 'cancel',
    });

    if (result.confirmed && result.value) {
      this.isLoading = true;

      this.sailingPortService.createPort(result.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.loadPorts();
        },
        error: () => {
          this.isLoading = false;
          this.hasLoaded = true;
        },
      });
    }
  }
}

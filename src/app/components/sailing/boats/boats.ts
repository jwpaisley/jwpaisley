import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Loader } from '../../loader/loader';
import { EmptyState } from '../../empty-state/empty-state';
import { Sailboat, SailboatService } from '../../../services/sailboat-service/sailboat-service';
import { ToastService } from '../../../services/toast-service/toast-service';
import { Action, ActionsService } from '../../../services/actions-service/actions-service';
import { DialogService } from '../../../services/dialog-service/dialog-service';
import { UserService } from '../../../services/user-service/user-service';
import { ActionDockButton } from '../../action-dock-button/action-dock-button';
import { ActionDock } from '../../action-dock/action-dock';
import { AddSailboatDialogData } from '../../add-sailboat-dialog/add-sailboat-dialog';
import { SailboatCard } from '../sailboat-card/sailboat-card';

@Component({
  selector: 'jwpaisley-boats',
  imports: [CommonModule, Loader, EmptyState, ActionDockButton, ActionDock, SailboatCard],
  standalone: true,
  templateUrl: './boats.html',
  styleUrl: './boats.scss',
})
export class Boats implements OnInit, OnDestroy {
  private sailboatService = inject(SailboatService);
  private toastService = inject(ToastService);
  private actionsService = inject(ActionsService);
  private dialogService = inject(DialogService);
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();

  boats: Sailboat[] = [];
  isLoading = true;
  isUserAdmin = false;

  ngOnInit(): void {
    this.isUserAdmin = this.userService.isUserAdmin();
    this.loadBoats();

    this.actionsService.actionEmitted$.pipe(takeUntil(this.destroy$)).subscribe((action: Action) => {
      if (action.type === 'addSailboat') {
        void this.openAddSailboatDialog();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadBoats(): void {
    this.isLoading = true;

    this.sailboatService.getSailboats().pipe(takeUntil(this.destroy$)).subscribe({
      next: (boats) => {
        this.boats = boats;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.addToast('failed to fetch boats', 'error', 'danger');
      },
    });
  }

  private async openAddSailboatDialog(): Promise<void> {
    if (!this.isUserAdmin) {
      return;
    }

    const result = await this.dialogService.openAddSailboatDialog<AddSailboatDialogData>({
      title: 'add sailboat',
      icon: 'directions_boat',
      confirmLabel: 'save sailboat',
      cancelLabel: 'cancel',
    });

    if (result.confirmed && result.value) {
      this.isLoading = true;

      this.sailboatService.createSailboat(result.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.loadBoats();
        },
        error: () => {
          this.isLoading = false;
          this.toastService.addToast('failed to create sailboat', 'error', 'danger');
        },
      });
    }
  }
}

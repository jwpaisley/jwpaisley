import { Component } from '@angular/core';
import { TabGroup } from '../../components/tab-group/tab-group';
import { Tab } from '../../components/tab/tab';
import { RouterOutlet } from '@angular/router';
import { ActionDockButton } from '../../components/action-dock-button/action-dock-button';
import { ActionDock } from '../../components/action-dock/action-dock';
import { Subject } from 'rxjs/internal/Subject';
import { UserService } from '../../services/user-service/user-service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'jwpaisley-photography',
  imports: [TabGroup, Tab, RouterOutlet, ActionDockButton, ActionDock],
  templateUrl: './photography.html',
  styleUrl: './photography.scss',
})
export class PhotographyPage {
    protected isUserAdmin = false;
    protected destroy$ = new Subject<void>();


    constructor(
        private userService: UserService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.userService.user$.subscribe(user => {
        this.isUserAdmin = this.userService.isUserAdmin();
        this.cdr.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

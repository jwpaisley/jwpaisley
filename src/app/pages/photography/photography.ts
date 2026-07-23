import { Component } from '@angular/core';
import { TabGroup } from '../../components/tab-group/tab-group';
import { Tab } from '../../components/tab/tab';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ActionDockButton } from '../../components/action-dock-button/action-dock-button';
import { ActionDock } from '../../components/action-dock/action-dock';
import { Subject } from 'rxjs/internal/Subject';
import { UserService } from '../../services/user-service/user-service';
import { ChangeDetectorRef } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'jwpaisley-photography',
  imports: [TabGroup, Tab, RouterOutlet, ActionDockButton, ActionDock],
  templateUrl: './photography.html',
  styleUrl: './photography.scss',
})
export class PhotographyPage {
    protected isUserAdmin = false;
    protected destroy$ = new Subject<void>();
    protected showTabs = true;

    constructor(
        private userService: UserService,
        private cdr: ChangeDetectorRef,
        private router: Router,
    ) {}

    ngOnInit() {
        this.updateTabVisibility();

        this.router.events
            .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
            .subscribe(() => {
                this.updateTabVisibility();
            });

        this.userService.user$.subscribe(user => {
            this.isUserAdmin = this.userService.isUserAdmin();
            this.cdr.detectChanges();
        });
    }

    private updateTabVisibility(): void {
        this.showTabs = !/^\/photography\/collections\/[^/]+/.test(this.router.url);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

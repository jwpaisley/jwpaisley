import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TabGroup } from '../../components/tab-group/tab-group';
import { Tab } from '../../components/tab/tab';
import { RouterOutlet } from '@angular/router';
import { ActionDockButton } from '../../components/action-dock-button/action-dock-button';
import { ActionDock } from '../../components/action-dock/action-dock';
import { Subject } from 'rxjs/internal/Subject';
import { UserService } from '../../services/user-service/user-service';

@Component({
  selector: 'jwpaisley-books',
  imports: [TabGroup, Tab, RouterOutlet, ActionDockButton, ActionDock],
  templateUrl: './books.html',
  styleUrl: './books.scss',
})
export class BooksPage implements OnInit, OnDestroy {
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

  onAddBook() {
    console.log('Add book clicked');
  }
}

import { 
  Component, 
  NgZone, 
  Inject, 
  PLATFORM_ID, 
  EventEmitter, 
  Output, 
  ViewChild, 
  ElementRef 
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService, User } from '../../services/user-service/user-service';

@Component({
  standalone: true,
  selector: 'jwpaisley-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  @Output() loginSuccess = new EventEmitter<void>();

  /**
   * This setter executes as soon as the #googleAuthButton element 
   * is rendered in the DOM. This effectively replaces ngAfterViewInit 
   * and eliminates the need for timeouts.
   */
  @ViewChild('googleAuthButton') set googleAuthButton(element: ElementRef) {
    if (element && isPlatformBrowser(this.platformId)) {
      this.initGoogleAuth(element.nativeElement);
    }
  }

  constructor(
    private ngZone: NgZone,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private initGoogleAuth(element: HTMLElement): void {
    // Verify the global 'google' object is available
    // @ts-ignore
    if (typeof google !== 'undefined' && google.accounts) {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '199559159303-u510108r3dv3oilmm8019bfihv8kp8lc.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // @ts-ignore
      google.accounts.id.renderButton(
        element, // Use the element reference directly
        { theme: "outline", size: "large" }
      );
    }
  }

  private handleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      this.userService.performLogin(response.credential);
      const user: User | undefined = this.userService.getUserInfoFromLocalStorage();

      if (user) {
        this.loginSuccess.emit();
      }
    });
  }
}
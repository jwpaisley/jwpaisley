import { Component, AfterViewInit, NgZone, Inject, PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  selector: 'jwpaisley-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit {
  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleAuth();
    }
  }

  private initGoogleAuth(): void {
    // Google Identity Services initialization happens in the global scope,
    // so we need to ignore TypeScript errors about the 'google' object.
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: '199559159303-u510108r3dv3oilmm8019bfihv8kp8lc.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // @ts-ignore
    google.accounts.id.renderButton(
      document.getElementById("google-auth-button"),
      { theme: "outline", size: "large" }
    );
  }

  private handleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      console.log("Encoded JWT ID token: " + response.credential);
    });
  }
}

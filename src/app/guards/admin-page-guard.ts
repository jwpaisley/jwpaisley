import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service/user-service';
import { isPlatformBrowser } from '@angular/common';

export const AdminPageGuard: CanActivateFn = (route, state) => {
    const platformId = inject(PLATFORM_ID);
    const userService = inject(UserService);
    const router = inject(Router);

    if (!isPlatformBrowser(platformId)) {
    return true; 
    }

    if (userService.isUserAdmin()) {
    return true;
    }

    return router.parseUrl('/');
};
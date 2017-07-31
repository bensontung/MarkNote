import {Injectable} from '@angular/core';
import {
    CanActivate,
    Router,
    Route,
    CanLoad,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    CanDeactivate
} from '@angular/router';

@Injectable()
export class GuardService implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(route);
        console.log(state);
        console.log('AuthGuard#canActivate called');
        if (state.url === '/') {
            return false;
        } else {
            return true;
        }
    }
}


import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Promise<boolean | UrlTree>
    | Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        if (isAuth && user.role.toLowerCase() === 'admin') {
          //nese admin leje tek komponentja e vet
          return true;
        } else if (isAuth && user.role.toLowerCase() === 'user') {
          //nese user ridrejtoje tek faqja e tij
          return this.router.createUrlTree(['/client']);
        } else {
          return this.router.createUrlTree(['/login']); //nese nuk eshte loguar ridrejtoje ne login
        }
      })
    );
  }
}

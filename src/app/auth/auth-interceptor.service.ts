import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, exhaustMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }

        const value = 'Bearer ' + user.token;
        const modifiedRequest = req.clone({
          headers: req.headers.append('Authorization', value),
        });

        return next.handle(modifiedRequest).pipe(
          catchError((error) => {
            // console.log(error);
            if (error.status === 401) {
              this.authService.user.next(null);
              localStorage.removeItem('activeUser');
              this.router.navigate(['/login']);
            }
            return throwError(error);
          })
        );
      })
    );
  }
}

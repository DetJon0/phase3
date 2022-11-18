import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

import { RegisterUser } from '../shared/models/user.model';

import { User } from './user.model';

export interface AuthResponse {
  username: string;
  email: string;
  role: string;
  token: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(
        environment.API_CALLS_LINK + '/Authentication/login',
        { email: email, password: password }
      )
      .pipe(
        catchError(this.handleError),
        tap((userData) => {
          this.handleAuthentification(userData);
        })
      );
  }
  sendToMainPageForRole(role: string) {
    switch (role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'user':
        this.router.navigate(['/client']);
        break;
    }
  }
  private handleError(errorRes: HttpErrorResponse) {
    // console.log(errorRes)
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.statusCode) {
      case 401: //login
        errorMessage = 'Please enter the correct email and password.';
        break;
      case 400: //tek sing up
        if (!errorRes.error.errors) {
          throwError(errorMessage);
        }
        errorMessage = errorRes.error.errors[0];
        break;
    }
    return throwError(errorMessage);
  }

  private handleAuthentification(userData: AuthResponse) {
    const user = new User(
      userData.username,
      userData.email,
      userData.role,
      userData.token,
      userData.id
    );

    this.user.next(user);
    localStorage.setItem('activeUser', JSON.stringify(user));

    this.sendToMainPageForRole(user.role);
  }

  autoLogIn() {
    const user: User = JSON.parse(localStorage.getItem('activeUser'));
    if (!user) {
      return;
    }

    this.user.next(user);
    // this.sendToMainPageForRole(user.role);
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('activeUser');
    this.router.navigate(['/login']);
  }

  singup(newUser: RegisterUser) {
    return this.http
      .post<AuthResponse>(
        environment.API_CALLS_LINK + '/Authentication/register',
        newUser
      )
      .pipe(catchError(this.handleError));
  }

  emitUser(userData: User) {
    this.user.next(userData);
  }
}

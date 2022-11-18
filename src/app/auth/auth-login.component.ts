import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from './user.model';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: [],
})
export class AuthLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoadingUser = false;
  errorMsg: string = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.autoLogIn();
    //if someone opens 2 login pages adn try to enter in same device with
    //2 accounts active at same time => IMPOSSIBLE so i check if localStorage has something
    const user: User = JSON.parse(localStorage.getItem('activeUser'));
    if (user) {
      this.authService.user.next(user);
      this.authService.sendToMainPageForRole(user.role);
      return;
    }

    this.isLoadingUser = true;
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: (data) => {
          this.isLoadingUser = false;
        },
        error: (errorMsg) => {
          this.isLoadingUser = false;
          this.errorMsg = errorMsg;
        },
      });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  constructor(private authService: AuthService, private router: Router) {}

  email = '';
  password = '';

  private unsubscribe$ = new Subject<void>();

  private onLoading = false;

  ngOnInit() {}
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async login() {
    if (this.email && this.password) {
      const result = await this.authService.SignIn(this.email, this.password);
      if (result && result.user) {
        this.router.navigate(['/chat-gpt']);
      } else {
        alert('Login failed');
      }
    } else {
      alert('Please enter email and password');
    }
  }

  async loginByGoogle() {
    const result = await this.authService.GoogleAuth();
    if (result && result.user) {
      const { uid, photoURL, email, displayName, phoneNumber } = result.user;
      this.authService
        .registerWithApi(
          uid,
          email ?? '',
          photoURL ?? '',
          displayName ?? '',
          phoneNumber ?? '',
          '',
          'other'
        )
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((x: any) => {
          this.onLoading = false;
          this.router.navigate(['/chat-gpt']);
        });
      this.router.navigate(['/chat-gpt']);
    } else {
      alert('Login failed');
    }
  }
}

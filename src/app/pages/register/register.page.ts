import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    fullName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    phoneNumber: [
      '',
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
    gender: ['male'],
  });
  onLoading = false;

  ngOnInit() {}
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  private unsubscribe$ = new Subject<void>();

  async onSubmit() {
    console.log('onSubmit');
    if (this.onLoading) return;
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.onLoading = true;
      const {
        email,
        password,
        confirmPassword,
        fullName,
        birthDate,
        phoneNumber,
        gender,
      } = this.form.value;
      if (password !== confirmPassword) {
        alert('Password and confirm password not match');
        return;
      }
      const signUpResult = await this.authService.SignUp(email!, password!);
      if (signUpResult && signUpResult.user) {
        const { uid, photoURL } = signUpResult.user;
        this.authService
          .registerWithApi(
            uid,
            email!,
            photoURL ?? '',
            fullName!,
            birthDate!,
            phoneNumber!,
            gender!
          )
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((x) => {
            this.onLoading = false;
            if (x) {
              alert('Register success');
              this.router.navigate(['/login']);
            } else {
              alert('Register failed');
            }
          });
      }
    } else {
      alert('Please fill in all required fields');
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { User } from 'firebase/auth';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../config';
import { IFirebaseUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private cookieService: CookieService,
    private http: HttpClient
  ) {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.isLoggedIn = true;
        this.idToken = await user.getIdToken();
        this.userData.next(user);
        this.cookieService.set('user', JSON.stringify(this.userData.value));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        this.isLoggedIn = false;
        this.idToken = '';
        this.cookieService.delete('user');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  private userData = new BehaviorSubject<IFirebaseUser | null>(null);
  public userData$ = this.userData.asObservable();

  idToken = '';
  isLoggedIn = false;

  private registerUrl = Config.apiUrl + 'auth/register';

  async initialize() {}

  // Sign in with email/password
  async SignIn(email: string, password: string) {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      if (result) {
        this.cookieService.set('user', JSON.stringify(result.user));
      }
      return result;
    } catch (error: any) {
      alert(error.message);
      return undefined;
    }
  }
  // Sign up with email/password
  async SignUp(email: string, password: string) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return result;
    } catch (error: any) {
      alert(error.message);
      return undefined;
    }
  }
  // Send email verfificaiton when new user sign up
  async SendVerificationMail() {
    const user = await this.afAuth.currentUser;
    if (user) {
      await user.sendEmailVerification();
      return true;
    }
    return false;
  }
  // Reset Forggot password
  async ForgotPassword(passwordResetEmail: string) {
    try {
      await this.afAuth.sendPasswordResetEmail(passwordResetEmail);
      alert('Password reset email sent, check your inbox.');
    } catch (error) {
      alert(error);
    }
  }
  // Sign in with Google
  async GoogleAuth() {
    const res = await this.AuthLogin(new auth.GoogleAuthProvider());
    if (res) {
      this.cookieService.set('user', JSON.stringify(res.user));
      return res;
    }
    return undefined;
  }
  // Auth logic to run auth providers
  async AuthLogin(provider: any) {
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      this.cookieService.set('user', JSON.stringify(result.user));
      return result;
    } catch (error) {
      alert(error);
      return undefined;
    }
  }
  /* Setting up user data in the Firestore database using AngularFirestore and the AngularFirestoreDocument service for login with username and password, signup with username and password, and sign in using a social authentication provider. */

  // Sign out
  async SignOut() {
    await this.afAuth.signOut();
    this.cookieService.delete('user');
    return;
  }

  registerWithApi(
    uid: string,
    email: string,
    photoUrl: string,
    fullName: string,
    phoneNumber: string,
    birthDate: string,
    gender: string
  ) {
    return this.http.post(this.registerUrl, {
      uid,
      email,
      photoUrl,
      fullName,
      phoneNumber,
      birthDate,
      gender,
    });
  }
}

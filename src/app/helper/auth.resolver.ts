import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IFirebaseUser } from '../interfaces/i-user';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthResolver implements Resolve<Observable<IFirebaseUser | null>> {
  constructor(private authService: AuthService) {}
  resolve(): Observable<IFirebaseUser | null> {
    return this.authService.userData$.pipe(filter((user) => user != null));
  }
}

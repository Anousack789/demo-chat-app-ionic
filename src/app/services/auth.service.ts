import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private loginUrl = Config.apiUrl + 'auth/login';
  private registerUrl = Config.apiUrl + 'auth/register';
  private logoutUrl = Config.apiUrl + 'auth/logout';
}

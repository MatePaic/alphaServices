import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuthData } from './auth-data';
import { LocalStorageService } from './local-storage.service';
import { IResponse } from './response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiURLUsers = environment.apiUrl + 'users';
  user:any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  public login(email: string, password: string): Observable<IAuthData> {
    return this.http.post<IAuthData>(`${this.apiURLUsers}/login`, { email, password });
  }

  public createUser(email: string, password: string): Observable<IAuthData> {
    return this.http.post<IAuthData>(`${this.apiURLUsers}/signup`, { email, password });
  }

  public sendEmailForResetPassword(email: string): Observable<IResponse> {
    return this.http.post<IResponse>(`${this.apiURLUsers}/reset-password-email`, {email});
  }

  public setPasswordForResetPassword(token: string, password: string): Observable<IResponse> {
    return this.http.post<IResponse>(`${this.apiURLUsers}/reset-password-set-password`, {token, password});
  }

  public logout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/login']);
  }
}

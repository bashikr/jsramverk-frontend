import { catchError, mapTo, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginCred, Tokens } from '../components/login/login.interface';
import { RegisterObj } from '../components/register/register.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthAPIService {
  readonly baseURL: string;
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  public readonly username = 'userName';
  private loggedUser: string | null = '';
  private LOCAL_DOMAINS: Array<string> = ['localhost', '127.0.0.1'];

  constructor(public http: HttpClient) {
    if (this.LOCAL_DOMAINS.includes(window.location.hostname)) {
      this.baseURL = 'http://localhost:1337/';
    } else {
      this.baseURL =
        'https://jsramverk-angular-editor-baaa19.azurewebsites.net/';
    }
  }

  loginReq(loginCred: LoginCred): Observable<boolean> {
    return this.http
      .post<any>(this.baseURL + 'login', loginCred, { observe: 'body' })
      .pipe(tap((tokens: any) => this.doLoginUser(loginCred.email, tokens)));
  }

  private doLoginUser(email: string, tokens: Tokens) {
    this.loggedUser = email;
    localStorage.setItem(this.username, email);
    this.storeTokens(tokens);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.token);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  logout() {
    return this.http
      .post<any>(
        this.baseURL + 'logout',
        { token: this.getRefreshToken() },
        { observe: 'body' }
      )
      .pipe(
        tap(() => this.doLogoutUser()),
        mapTo(true),
        catchError((error: any) => {
          alert(error.error);
          return of(false);
        })
      );
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  isLoggedIn() {
    return !this.getJwtToken();
  }

  refreshToken() {
    return this.http
      .post<any>(this.baseURL + 'token', {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens: Tokens) => {
          this.storeJwtToken(tokens.token);
        })
      );
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  registerReq(registerObj: RegisterObj) {
    return this.http.post(this.baseURL + 'register', registerObj, {
      observe: 'body',
    });
  }
}

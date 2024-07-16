import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private cookieService: CookieService) { }

  isDecoded(): boolean {
    const token = this.getToken();
    const decodedToken = this.decodeToken();
    return token !== null && token !== '' && decodedToken !== null;
  }

  setToken(token: string): void {
    this.cookieService.set('token', token);
  }

  flushToken() {
    this.cookieService.delete('token', '/');
  }

  getToken() {
    const token = this.cookieService.get('token');
    if (token === null || token === undefined) {
      return null;
    } else {
      return token;
    }
  }

  decodeToken() {
    const usertoken = this.getToken();
    if(usertoken) {
      const decodedToken = jwtDecode(usertoken);
      return decodedToken;
    }
    return null;
  }

  usernameToken(decodedToken: any): string {
    if (decodedToken && decodedToken.data && decodedToken.data.name) {
      return decodedToken.data.name;
    } else {
      return '';
    }
  }

  userIDToken(decodedToken: any): number {
    if (decodedToken && decodedToken.data && decodedToken.data.user) {    
      return decodedToken.data.user;
    } else {
      return 0;
    }
  }

  userEmailToken(decodedToken: any): string {
    if (decodedToken && decodedToken.data && decodedToken.data.email) {
      return decodedToken.data.email;
    } else {
      return '';
    }
  } 

  userRoleToken(decodedToken: any): string {
    if (decodedToken && decodedToken.data) {
      return decodedToken.data.role;
    } else {
      return '';
    }
  } 
}

import { CanActivateFn } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { inject } from '@angular/core';
import { Router } from '@angular/router';
// import "core-js/stable/atob"; // <- polyfill here

import { AuthService } from '../authentication/auth.service';
import { TokenService } from '../authentication/token.service';

export const authGuard: CanActivateFn = (route, state) => {

  //Decode current token held
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = inject(TokenService)

  if(token.getToken() === null) {
    console.log("no token")
    return false;
  }

  // const decoded = token.decodeToken();
  // const priv = token.userRoleToken(decoded);

  // const urlRoot = state.url.split("/")[1];
  // // Logging on to Admin page
  // if(urlRoot === "admin" && priv !== "admin") {
  //   return false;
  // }

  console.log("got token")

  return true;

};
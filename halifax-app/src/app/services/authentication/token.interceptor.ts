import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from './token.service';


//This triggers at every single post request.
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);
  const authToken = inject(TokenService).getToken();
  req = req.clone({
    setHeaders: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

  const path = router.url.split('/')[1]
  return next(req).pipe(
    catchError((err) => {
      if(err.status == 403){
        console.error(err);
        router.navigate([`/${path}`]);
      }
      return throwError(err);
    })
  )
}


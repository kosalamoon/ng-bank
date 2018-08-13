/*
import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = sessionStorage.getItem('token');

    if (token != null) {
      const copiedRequest = req.clone({
        headers: req.headers.append('Authorization', 'Bearer ' + token)
      });
      return next.handle(copiedRequest);

    }
    return next.handle(req);
  }
}
*/

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  intercept( req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'KnxQnhf7tVYilKcGpkRh3RulWLoT41e0';
    return next.handle(req.clone({ setHeaders: { AuthToken : token } }));
  }
}

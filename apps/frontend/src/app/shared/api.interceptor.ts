import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // eslint-disable-next-line no-console
    console.log(
      'APIInterceptor',
      req.url,
      environment.api.serverUrl,
      new URL(req.url, environment.api.serverUrl).href
    );
    const apiReq = req.clone({
      url: new URL(req.url, environment.api.serverUrl).href,
    });
    return next.handle(apiReq);
  }
}

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  AuthHttpInterceptor,
  provideAuth0,
} from '@auth0/auth0-angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { APIInterceptor } from './shared/api.interceptor';
import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: APIInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    provideRouter(appRoutes),
    provideAuth0({
      ...environment.auth0,
      httpInterceptor: {
        allowedList: [`${environment.api.serverUrl}/api/*`],
      },
    }),
    provideAnimationsAsync(),
  ],
};

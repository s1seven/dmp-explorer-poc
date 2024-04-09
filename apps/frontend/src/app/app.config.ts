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


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true,
    },
    provideRouter(appRoutes),
    provideAuth0({
      domain: 'receiver-local.eu.auth0.com',
      clientId: '3MG27kBT9VL5t2OMrPOpW2zOKq3hMUEU',
      authorizationParams: {
        audience: 'https://api.s1seven-receiver.local',
        redirect_uri: window.location.origin,
      },
      httpInterceptor: {
        allowedList: [`http://localhost:3000/api/batches`],
      },
    }),
    provideAnimationsAsync(),
  ],
};

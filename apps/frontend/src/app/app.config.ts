import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAuth0({
      domain: 'receiver-local.eu.auth0.com',
      clientId: '3MG27kBT9VL5t2OMrPOpW2zOKq3hMUEU',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
};

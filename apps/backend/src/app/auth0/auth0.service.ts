import { Injectable, Logger } from '@nestjs/common';
import {
  AuthenticationClient,
  AuthenticationClientOptions,
  ManagementClient,
  TokenSet,
} from 'auth0';

@Injectable()
export class Auth0Service {
  private authenticationClient: AuthenticationClient;
  private logger = new Logger(Auth0Service.name);

  constructor() {
    const authenticationClientOptions: AuthenticationClientOptions = {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    };
    this.authenticationClient = new AuthenticationClient(
      authenticationClientOptions
    );
  }

  getManagementClient(token: string) {
    return new ManagementClient({
      token,
      domain: process.env.AUTH0_DOMAIN,
    });
  }

  async getAccessToken(): Promise<TokenSet['access_token']> {
    const response = await this.clientCredentialsGrant(
      'https://receiver-local.eu.auth0.com/api/v2/'
    );
    return response.access_token;
  }

  private async clientCredentialsGrant(audience: string): Promise<TokenSet> {
    const response =
      await this.authenticationClient.oauth.clientCredentialsGrant({
        audience,
      });
    return response.data;
  }

  async getUsers() {
    const accessToken = await this.getAccessToken();
    const auth0 = this.getManagementClient(accessToken);
    const { data } = await auth0.users.getAll();
    return data;
  }

  async createUser(user: { email: string; password: string }) {
    const accessToken = await this.getAccessToken();
    const auth0Client = this.getManagementClient(accessToken);
    const { data } = await auth0Client.users.create({
      ...user,
      connection: 'Username-Password-Authentication',
    });
    return data.user_id;
  }

  async deleteUser(userId: string): Promise<void> {
    const accessToken = await this.getAccessToken();
    const auth0Client = this.getManagementClient(accessToken);
    await auth0Client.users.delete({ id: userId });
    this.logger.verbose(`Deleted user ${userId}`);
  }
}

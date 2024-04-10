import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {
  auth,
  InvalidTokenError,
  JWTPayload,
  UnauthorizedError,
} from 'express-oauth2-jwt-bearer';
import { promisify } from 'util';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_NAMESPACE = this.configService.get<string>('AUTH0_NAMESPACE');
  private AUTH0_AUDIENCE = this.configService.get<string>('AUTH0_AUDIENCE');
  private AUTH0_DOMAIN = this.configService.get<string>('AUTH0_DOMAIN');

  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Requires authentication');
    }
    const updatedJwtPayload = this.decodeToken(token);
    // TODO: improve this process
    const email = updatedJwtPayload[`${this.AUTH0_NAMESPACE}/email`];
    request.user = { email };
    const validateAccessToken = promisify(
      auth({
        audience: this.AUTH0_AUDIENCE,
        issuerBaseURL: this.AUTH0_DOMAIN,
        tokenSigningAlg: 'RS256',
      })
    );

    try {
      await validateAccessToken(request, response);

      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        throw new UnauthorizedException('Bad credentials');
      }

      if (error instanceof UnauthorizedError) {
        throw new UnauthorizedException('Requires authentication');
      }

      throw new InternalServerErrorException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private decodeToken(token: string): JWTPayload {
    const base64Payload = token.split('.')[1];
    const payloadBuffer = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payloadBuffer.toString()) as unknown as JWTPayload;
  }
}

import type { Request } from 'express';

export type ReqUser = {
  // sub: string;
  email: string;
};

export interface AuthenticatedRequest extends Request {
  user: ReqUser;
}

export enum Environment {
  Local = 'local',
  Development = 'development',
  DockerDevelopment = 'docker_development',
  Production = 'production',
  CI = 'ci',
  Staging = 'staging',
  Test = 'test',
}

export enum Unit {
  KG = 'kg',
  TO = 'to',
  M = 'm',
}

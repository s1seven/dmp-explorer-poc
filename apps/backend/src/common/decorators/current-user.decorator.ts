import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { ReqUser } from '../../app/constants/constants';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ReqUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

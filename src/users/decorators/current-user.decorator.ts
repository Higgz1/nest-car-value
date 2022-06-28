import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    // get underlying request that is received
    const request = context.switchToHttp().getRequest();

    // get any property within the current session
    return request.currentUser;
  },
);

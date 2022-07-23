const cookieSession = require('cookie-Session');
import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setupApp = (app: INestApplication) => {
  app.use(
    cookieSession({
      keys: ['carProject'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};

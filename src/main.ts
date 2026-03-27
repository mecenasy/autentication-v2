import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TypeConfigService } from './configs/types.config.service';
import { AppConfig } from './configs/app.configs';
import { initProxy } from './libs/proxy/proxy';
import { initSession } from './libs/session/init-session';
import { initCorse } from './libs/corse/corse';
import { initSwagger } from './libs/swagger/swagger';
import csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      },
    }),
  );

  await initProxy(app);
  await initSwagger(app);
  await initSession(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  initCorse(app);

  const config = app.get(TypeConfigService);
  const url = config.getOrThrow<AppConfig>('app').appUrl;

  await app.listen(process.env.PORT || 3000, '0.0.0.0');

  console.log(`Application is running on: ${url}:${process.env.PORT || 3000}`);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

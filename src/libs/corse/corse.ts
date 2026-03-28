import { INestApplication } from '@nestjs/common';
import { SessionConfig } from '../../configs/session.config';
import { TypeConfigService } from '../../configs/types.config.service';

export const initCorse = (app: INestApplication) => {
  const config = app.get(TypeConfigService);
  const allowedOrigin =
    config.getOrThrow<SessionConfig>('session').allowedOrigin;

  app.enableCors({
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    origin: (origin, callback) => {
      // Allow the configured origin and localhost for development
      const allowedOrigins = [
        allowedOrigin,
        'http://localhost:4000',
        'http://localhost:3000',
        'http://127.0.0.1:4000',
        'http://127.0.0.1:3000',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
};

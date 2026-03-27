import { registerAs } from '@nestjs/config';
import ms from 'ms';

export interface JwtConfig {
  secretKey: string;
  expireAt: ms.StringValue;
}

export const jwtConfig = registerAs(
  'jwt',
  (): JwtConfig => ({
    secretKey: process.env.JWT_SECRET_KEY as string,
    expireAt: process.env.JWT_EXPIRE_AT as ms.StringValue,
  }),
);

import { Global, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/configs/auth.config';
import { TypeConfigService } from 'src/configs/types.config.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: TypeConfigService) => ({
        secret: config.get<JwtConfig>('jwt')?.secretKey,
        signOptions: {
          expiresIn: config.get<JwtConfig>('jwt')?.expireAt,
        },
      }),
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}

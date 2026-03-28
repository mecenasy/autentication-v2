import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './authenticator/user/user.module';
import { CommonModule } from './common/common.module';
import { GrpcModule } from './grpc/grpc.module';
import { AuthModule } from './authenticator/auth/auth.module';
import { NotifyModule } from './authenticator/notify/notify.module';
import { SocialConfigModule } from './authenticator/social-config/social-config.module';
import { CsrfModule } from './csrf/csrf.module';
import { CsrfInterceptor } from './csrf/csrf.interceptor';

@Module({
  imports: [
    UserModule,
    CommonModule,
    GrpcModule,
    AuthModule,
    NotifyModule,
    SocialConfigModule,
    CsrfModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CsrfInterceptor,
    },
  ],
})
export class AppModule {}

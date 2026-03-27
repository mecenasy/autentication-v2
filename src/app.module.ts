import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './authenticator/user/user.module';
import { CommonModule } from './common/common.module';
import { GrpcModule } from './grpc/grpc.module';
import { AuthModule } from './authenticator/auth/auth.module';
import { NotifyModule } from './authenticator/notify/notify.module';
import { SocialConfigModule } from './authenticator/social-config/social-config.module';

@Module({
  imports: [
    UserModule,
    CommonModule,
    GrpcModule,
    AuthModule,
    NotifyModule,
    SocialConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './au/user/user.module';
import { CommonModule } from './common/common.module';
import { GrpcModule } from './grpc/grpc.module';
import { AuthModule } from './au/auth/auth.module';
import { NotifyModule } from './au/notify/notify.module';

@Module({
  imports: [UserModule, CommonModule, GrpcModule, AuthModule, NotifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

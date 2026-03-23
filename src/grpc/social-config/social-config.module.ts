import { Module } from '@nestjs/common';
import { SocialConfigController } from './social-config.controller';
import { SocialConfigService } from './social-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialConfig } from 'src/grpc/social-config/entity/social-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialConfig])],
  controllers: [SocialConfigController],
  providers: [SocialConfigService],
})
export class SocialConfigModule {}

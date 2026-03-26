import { Module } from '@nestjs/common';
import { FederationController } from './federation.controller';
import { FederationService } from './federation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Federation } from './entity/federation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Federation])],
  controllers: [FederationController],
  providers: [FederationService],
})
export class FederationModule {}

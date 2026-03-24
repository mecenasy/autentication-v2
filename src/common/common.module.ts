import { Global, Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { GetawayModule } from './getaway/getaway.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { ProxyModule } from './proxy/proxy.module';
import { GraphQlModule } from './graph-ql/graph-ql.module';
import { CacheService } from './cache/cache.service';
import { EventService } from './event/event.service';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [
    CqrsModule,
    GraphQlModule,
    PostgresModule,
    RedisModule,
    HttpModule,
    GetawayModule,
    ConfigsModule,
    ProxyModule,
  ],
  providers: [CacheService, EventService],
  exports: [CacheService, EventService],
})
export class CommonModule {}

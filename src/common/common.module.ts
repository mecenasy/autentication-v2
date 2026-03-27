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
import { TypeConfigService } from 'src/configs/types.config.service';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './guards/user.guard';

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
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    CacheService,
    EventService,
    TypeConfigService,
    {
      provide: TypeConfigService,
      useExisting: ConfigService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [CacheService, EventService],
})
export class CommonModule {}

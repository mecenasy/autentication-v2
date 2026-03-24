import { Module } from '@nestjs/common';
import { RiskService } from './risk.service';
import { GeoService } from 'src/common/geo/geo.service';

@Module({
  providers: [RiskService, GeoService],
  exports: [RiskService, GeoService],
})
export class RiskModule {}

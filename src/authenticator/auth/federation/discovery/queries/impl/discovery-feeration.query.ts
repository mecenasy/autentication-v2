import { Query } from '@nestjs/cqrs';
import { DiscoveryFederationType } from '../../dto/discovery.type';

export class DiscoveryFederationQuery extends Query<DiscoveryFederationType> {
  constructor(public readonly clientId: string) {
    super();
  }
}

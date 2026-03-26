import { Query } from '@nestjs/cqrs';
import { GetFederationDetailsType } from '../../dto/get-federation-details.type';

export class GetAllFederationQuery extends Query<GetFederationDetailsType> {
  constructor(public readonly userId: string) {
    super();
  }
}

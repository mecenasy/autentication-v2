import { Query } from '@nestjs/cqrs';
import { GetFederationType } from '../../dto/get-federation..type';

export class GetFederationQuery extends Query<GetFederationType[]> {
  constructor(
    public readonly clientId: string,
    public readonly userId: string,
  ) {
    super();
  }
}

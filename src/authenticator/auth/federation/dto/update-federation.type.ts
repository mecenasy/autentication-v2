import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CratedFederationInputType } from './create-federation-input.type';

@InputType()
export class UpdateFederationType extends PartialType(
  CratedFederationInputType,
) {
  @Field(() => ID)
  id: string;
}

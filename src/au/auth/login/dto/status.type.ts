import { Field, ObjectType } from '@nestjs/graphql';
import { AuthStatus } from 'src/au/auth/types/login-status';

@ObjectType()
export class StatusType {
  @Field()
  status: AuthStatus;
}

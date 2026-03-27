import { Field, ObjectType } from '@nestjs/graphql';
import { StatusType } from 'src/authenticator/auth/login/dto/status.type';

@ObjectType()
export class AcceptType extends StatusType {
  @Field()
  dataUrl: string;
}

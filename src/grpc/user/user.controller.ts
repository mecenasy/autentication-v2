import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type {
  UserProxyServiceController,
  UserResponse,
  SocialUserResponse,
  CreateUserRequest,
  CreateSocialUserRequest,
  CheckExistRequest,
  CheckExistResponse,
} from 'src/proto/user';
import { UserService } from './user.service';

@Controller()
export class UserGrpcController implements UserProxyServiceController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserProxyService', 'CreateUser')
  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    return await this.userService.createUser(request);
  }

  @GrpcMethod('UserProxyService', 'CreateSocialUser')
  async createSocialUser(
    request: CreateSocialUserRequest,
  ): Promise<SocialUserResponse> {
    return await this.userService.createSocialUser(request);
  }

  @GrpcMethod('UserProxyService', 'CheckExist')
  async checkExist({ email }: CheckExistRequest): Promise<CheckExistResponse> {
    return { exist: !!(await this.userService.findUser(email)) };
  }
}

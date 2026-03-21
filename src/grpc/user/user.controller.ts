import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  type UserProxyServiceController,
  type UserResponse,
  type SocialUserResponse,
  type CreateUserRequest,
  type CreateSocialUserRequest,
  type CheckExistRequest,
  type CheckExistResponse,
  USER_PROXY_SERVICE_NAME,
} from 'src/proto/user';
import { UserGrpcService } from './user.service';

@Controller()
export class UserGrpcController implements UserProxyServiceController {
  constructor(private readonly userService: UserGrpcService) {}

  @GrpcMethod(USER_PROXY_SERVICE_NAME, 'CreateUser')
  async createUser(request: CreateUserRequest): Promise<UserResponse> {
    return await this.userService.createUser(request);
  }

  @GrpcMethod(USER_PROXY_SERVICE_NAME, 'CreateSocialUser')
  async createSocialUser(
    request: CreateSocialUserRequest,
  ): Promise<SocialUserResponse> {
    return await this.userService.createSocialUser(request);
  }

  @GrpcMethod(USER_PROXY_SERVICE_NAME, 'CheckExist')
  async checkExist({ email }: CheckExistRequest): Promise<CheckExistResponse> {
    return { exist: !!(await this.userService.findUser(email)) };
  }
}

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
  FindUserByIdRequest,
  FindUserRequest,
  FindSocialUserRequest,
} from 'src/proto/user';
import { USER_PROXY_SERVICE_NAME } from 'src/proto/user';
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

  @GrpcMethod(USER_PROXY_SERVICE_NAME, 'FindUserById')
  async findUserById({ id }: FindUserByIdRequest): Promise<UserResponse> {
    return await this.userService.findUserById(id);
  }

  @GrpcMethod(USER_PROXY_SERVICE_NAME, 'FindUser')
  async findUser({ email }: FindUserRequest): Promise<UserResponse> {
    return await this.userService.findUserByEmail(email);
  }

  @GrpcMethod(USER_PROXY_SERVICE_NAME, 'FindSocialUser')
  async findSocialUser(user: FindSocialUserRequest): Promise<UserResponse> {
    return await this.userService.findSocialUser(user);
  }
}

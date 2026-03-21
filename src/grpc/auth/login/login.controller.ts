import { Controller } from '@nestjs/common';
import { LoginService } from './login.service';
import {
  LOGIN_PROXY_SERVICE_NAME,
  LoginProxyServiceController,
  type LoginStatusRequest,
  type LoginRequest,
  type LoginResponse,
  type LoginStatusResponse,
} from 'src/proto/login';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class LoginController implements LoginProxyServiceController {
  constructor(private readonly loginService: LoginService) {}

  @GrpcMethod(LOGIN_PROXY_SERVICE_NAME, 'Login')
  async login(request: LoginRequest): Promise<LoginResponse> {
    return await this.loginService.login(request.email, request.password);
  }

  @GrpcMethod(LOGIN_PROXY_SERVICE_NAME, 'GetLoginStatus')
  async getLoginStatus(
    request: LoginStatusRequest,
  ): Promise<LoginStatusResponse> {
    return await this.loginService.getLoginStatus(request.userId);
  }
}

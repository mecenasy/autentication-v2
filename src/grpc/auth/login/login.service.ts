import { Injectable } from '@nestjs/common';
import { PasswordService } from 'src/grpc/user/password/password.service';
import { UserGrpcService } from 'src/grpc/user/user.service';
import { LoginResponse, LoginStatusResponse } from 'src/proto/login';

@Injectable()
export class LoginService {
  constructor(
    private readonly userService: UserGrpcService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userService.findUserWithPassword(email);
    if (!user) {
      return { success: false, message: 'Unknown user' };
    }

    const isPasswordValid = this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    return {
      success: true,
      message: 'Login successful',
      phone: user.phone,
      is2fa: user.userSettings.isTwoFactorEnabled,
    };
  }

  async getLoginStatus(userId: string): Promise<LoginStatusResponse> {
    const user = await this.userService.findUserSettingsById(userId);
    if (!user) {
      return { message: 'Unknown user' };
    }
    return {
      userStatus: {
        admin: user.admin,
        email: user.email,
        isAdaptive: user.userSettings.isAdaptiveAuthEnabled,
        is2fa: user.userSettings.isTwoFactorEnabled,
      },
    };
  }
}

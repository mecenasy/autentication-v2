import { Controller } from '@nestjs/common';
import {
  SETTINGS_PROXY_SERVICE_NAME,
  SettingsProxyServiceController,
  type TfaRequest,
  TfaResponse,
  type TfaVerifyRequest,
} from '../../../proto/user-settings';
import { GrpcMethod } from '@nestjs/microservices';
import { UserSettingsService } from './user-settings.service';

@Controller()
export class UserSettingsController implements SettingsProxyServiceController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @GrpcMethod(SETTINGS_PROXY_SERVICE_NAME, 'reject2Fa')
  async reject2Fa({ id }: TfaRequest): Promise<TfaResponse> {
    return await this.userSettingsService.reject2fa(id);
  }

  @GrpcMethod(SETTINGS_PROXY_SERVICE_NAME, 'verify2Fa')
  async verify2Fa({ id, secret }: TfaVerifyRequest): Promise<TfaResponse> {
    return await this.userSettingsService.verify2fa(id, secret);
  }
}

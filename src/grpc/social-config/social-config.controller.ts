import { Controller } from '@nestjs/common';
import { SocialConfigService } from './social-config.service';
import type {
  ActiveSocialConfigRequest,
  ActiveSocialConfigResponse,
  CreateSocialConfigRequest,
  DeleteSocialConfigRequest,
  DeleteSocialConfigResponse,
  FindAllSocialConfigsResponse,
  GetSocialConfigRequest,
  SocialConfigProxyServiceController,
  SocialConfigResponse,
  UpdateSocialConfigRequest,
} from 'src/proto/social-config';
import { SOCIAL_CONFIG_PROXY_SERVICE_NAME } from 'src/proto/social-config';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class SocialConfigController implements SocialConfigProxyServiceController {
  constructor(private readonly socialConfigService: SocialConfigService) {}

  @GrpcMethod(SOCIAL_CONFIG_PROXY_SERVICE_NAME, 'FindAllSocialConfigs')
  async findAllSocialConfigs(): Promise<FindAllSocialConfigsResponse> {
    return await this.socialConfigService.findAll();
  }

  @GrpcMethod(SOCIAL_CONFIG_PROXY_SERVICE_NAME, 'CreateSocialConfig')
  async createSocialConfig(
    request: CreateSocialConfigRequest,
  ): Promise<SocialConfigResponse> {
    return await this.socialConfigService.create(request);
  }

  @GrpcMethod(SOCIAL_CONFIG_PROXY_SERVICE_NAME, 'UpdateSocialConfig')
  async updateSocialConfig(
    request: UpdateSocialConfigRequest,
  ): Promise<SocialConfigResponse> {
    return await this.socialConfigService.update(request);
  }

  @GrpcMethod(SOCIAL_CONFIG_PROXY_SERVICE_NAME, 'DeleteSocialConfig')
  async deleteSocialConfig(
    request: DeleteSocialConfigRequest,
  ): Promise<DeleteSocialConfigResponse> {
    await this.socialConfigService.remove(request.id);
    return { id: request.id };
  }

  @GrpcMethod(SOCIAL_CONFIG_PROXY_SERVICE_NAME, 'GetSocialConfig')
  async getSocialConfig(
    request: GetSocialConfigRequest,
  ): Promise<SocialConfigResponse> {
    return await this.socialConfigService.findByProvider(request.id);
  }

  @GrpcMethod(SOCIAL_CONFIG_PROXY_SERVICE_NAME, 'ActiveSocialConfig')
  async activeSocialConfig(
    request: ActiveSocialConfigRequest,
  ): Promise<ActiveSocialConfigResponse> {
    return await this.socialConfigService.toggleActive(request.id);
  }
}

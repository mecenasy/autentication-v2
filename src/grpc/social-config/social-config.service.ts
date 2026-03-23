import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { SocialConfig } from 'src/grpc/social-config/entity/social-config.entity';
import {
  ActiveSocialConfigResponse,
  CreateSocialConfigRequest,
  FindAllSocialConfigsResponse,
  SocialConfigResponse,
  UpdateSocialConfigRequest,
  DeleteSocialConfigResponse,
} from 'src/proto/social-config';
import { Repository } from 'typeorm';
import { mapProvider } from '../../libs/utils/provider-enum-mapper';

@Injectable()
export class SocialConfigService {
  constructor(
    @InjectRepository(SocialConfig)
    private readonly socialConfigRepository: Repository<SocialConfig>,
  ) {}

  async findAll(): Promise<FindAllSocialConfigsResponse> {
    return { socialConfigs: await this.socialConfigRepository.find() };
  }

  async findByProvider(provider: string): Promise<SocialConfigResponse> {
    return await this.socialConfigRepository.findOneByOrFail({
      provider: mapProvider(provider),
    });
  }

  async create(dto: CreateSocialConfigRequest): Promise<SocialConfigResponse> {
    const config = this.socialConfigRepository.create({
      ...dto,
      provider: mapProvider(dto.provider),
    });
    return await this.socialConfigRepository.save(config);
  }

  async update({
    id,
    ...dto
  }: UpdateSocialConfigRequest): Promise<SocialConfigResponse> {
    await this.socialConfigRepository.update(id, {
      ...dto,
      provider: dto.provider ? mapProvider(dto.provider) : undefined,
    });
    return await this.socialConfigRepository.findOneByOrFail({ id });
  }

  async toggleActive(id: string): Promise<ActiveSocialConfigResponse> {
    const config = await this.socialConfigRepository.findOneByOrFail({ id });
    config.active = !config.active;
    await this.socialConfigRepository.save(config);

    return { active: config.active, id };
  }

  async remove(id: string): Promise<DeleteSocialConfigResponse> {
    await this.socialConfigRepository.delete(id);
    return { id };
  }
}

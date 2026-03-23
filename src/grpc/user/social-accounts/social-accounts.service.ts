import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccounts } from './entity/social-accounts.entity';

@Injectable()
export class SocialAccountsService {
  constructor(
    @InjectRepository(SocialAccounts)
    private readonly repository: Repository<SocialAccounts>,
  ) {}
  public create(provider: string, providerId: string) {
    return this.repository.create({ provider, providerId });
  }
}

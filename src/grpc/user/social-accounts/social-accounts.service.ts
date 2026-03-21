import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialAccounts } from 'src/common/postgres/entity/social-accounts.entity';
import { Repository } from 'typeorm';

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

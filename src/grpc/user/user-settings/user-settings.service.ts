import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSettings } from 'src/common/postgres/entity/user-settings.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private readonly repository: Repository<UserSettings>,
  ) {}

  public create() {
    return this.repository.create();
  }
}

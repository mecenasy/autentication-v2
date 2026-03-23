import { Injectable, Logger } from '@nestjs/common';
import { PasswordService } from './password/password.service';
import { UserSettingsService } from './user-settings/user-settings.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccountsService } from './social-accounts/social-accounts.service';
import type {
  CreateSocialUserRequest,
  CreateUserRequest,
  SocialUserResponse,
  UserResponse,
} from 'src/proto/user';
import { User } from './entity/user.entity';

@Injectable()
export class UserGrpcService {
  logger: Logger;
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userSettingsService: UserSettingsService,
    private readonly socialAccountsService: SocialAccountsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.logger = new Logger(UserGrpcService.name);
  }

  public async createUser({
    email,
    password,
    phone,
  }: CreateUserRequest): Promise<UserResponse> {
    let user = await this.findUserWithPassword(email);

    if (!user) {
      user = this.userRepository.create({
        email,
        phone,
        socialAccounts: [],
        password: this.passwordService.createPassword(password),
        userSettings: this.userSettingsService.create(),
      });
    } else if (!user.password) {
      user.phone = phone;
      user.password = this.passwordService.createPassword(password);
    }

    const { id } = await this.save(user);

    return { id, email, phone };
  }

  public async createSocialUser({
    email,
    provider,
    providerId,
  }: CreateSocialUserRequest): Promise<SocialUserResponse> {
    let user = await this.findUser(email);

    if (!user) {
      user = this.userRepository.create({
        email,
        socialAccounts: [],
      });
    }
    const hasProvider = user.socialAccounts.some(
      (account) => account.providerId === providerId,
    );

    if (!hasProvider) {
      const socialAccount = this.socialAccountsService.create(
        provider,
        providerId,
      );
      user.socialAccounts.push(socialAccount);
    }
    const { id } = await this.save(user);

    return { id, email };
  }

  public async findUser(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.socialAccounts', 'social')
      .where('user.email = :email', { email })
      .getOne();
  }

  public async findUserByEmail(email: string): Promise<User | UserResponse> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.socialAccounts', 'social')
      .where('user.email = :email', { email })
      .getOne();

    return (
      result || {
        id: '',
        email: '',
        phone: '',
      }
    );
  }

  public async findUserById(id: string): Promise<User | UserResponse> {
    const result = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return (
      result || {
        id: '',
        email: '',
        phone: '',
      }
    );
  }

  // public async findSocialUser({
  //   email,
  //   provider,
  //   providerId,
  // }: SocialUser): Promise<User> {
  //   return await this.userRepository
  //     .createQueryBuilder('user')
  //     .leftJoin('user.socialAccounts', 'social')
  //     .where('user.email = :email', { email })
  //     .andWhere('social.provider = :provider', { provider })
  //     .andWhere('social.providerId = :providerId', { providerId })
  //     .getOneOrFail();
  // }

  public async findUserWithPassword(login: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.password', 'password')
      .leftJoinAndSelect('user.userSettings', 'settings')
      .where('user.email = :email', { email: login })
      .getOne();
  }

  public async findUserSettingsById(id: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userSettings', 'settings')
      .where('user.id = :id', { id })
      .getOneOrFail();
  }

  public async findUserSettings(login: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userSettings', 'settings')
      .where('user.email = :email', { email: login })
      .getOneOrFail();
  }

  public async findUserWithPasswordById(id?: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.password', 'password')
      .leftJoinAndSelect('user.userSettings', 'settings')
      .orWhere('user.id = :id', { id })
      .getOneOrFail();
  }

  // public async findUseWithPasskeyById(userId: string) {
  //   return await this.userRepository
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.passkey', 'passkey')
  //     .where('user.id = :id', { id: userId })
  //     .getOneOrFail();
  // }

  public async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}

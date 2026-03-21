import { IsEmail, IsPhoneNumber } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Password } from './password.entity';
import { UserSettings } from './user-settings.entity';
import { AtLeastOneExists } from '../../decorators/at-least-one-exist.decorator';
import { SocialAccounts } from './social-accounts.entity';
import { PassKey } from './passkey.entity';
import { ProjectAuth } from './project-auth.entity';
import { History } from './history.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
    nullable: true,
  })
  @IsPhoneNumber()
  phone: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  admin: boolean;

  @AtLeastOneExists('socialAccounts')
  @OneToOne(() => Password, (password) => password.user, {
    cascade: true,
    nullable: true,
  })
  password: Password;

  @AtLeastOneExists('password')
  @OneToMany(() => SocialAccounts, (social) => social.user, {
    cascade: true,
    nullable: true,
  })
  socialAccounts: SocialAccounts[];

  @OneToMany(() => PassKey, (passkey) => passkey.user, {
    cascade: true,
    nullable: true,
  })
  passkey: PassKey[];

  @OneToMany(() => ProjectAuth, (project) => project.user, {
    cascade: true,
    nullable: true,
  })
  projectsAuth: ProjectAuth[];

  @OneToOne(() => UserSettings, (settings) => settings.user, {
    cascade: true,
    nullable: false,
  })
  userSettings: UserSettings;

  @OneToMany(() => History, (history) => history.user, {
    cascade: true,
    nullable: true,
  })
  authHistories: History[];
}

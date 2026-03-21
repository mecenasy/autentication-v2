import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
} from 'typeorm';
import { User } from './user.entity';

@Entity('project_auth')
export class ProjectAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'client_id',
    type: 'uuid',
    unique: true,
    nullable: false,
  })
  clientId: string;

  @Column({
    name: 'hash',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  hash: string;

  @Column({
    name: 'salt',
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  salt: string;

  @Column({
    name: 'client_url',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  clientUrl: string;

  @Column({
    name: 'is_activated',
    type: 'boolean',
    default: true,
  })
  isActivated: boolean;

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
  @ManyToOne(() => User, (user) => user.projectsAuth, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;
}

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../entity/user.entity';
import { Provider } from 'src/libs/utils/provider';

@Entity('social_accounts')
export class SocialAccounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: Provider,
    nullable: false,
  })
  provider: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  providerId: string;

  @ManyToOne(() => User, (user) => user.password, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;
}

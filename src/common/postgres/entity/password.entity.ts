import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Password {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  hash: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  salt: string;

  @OneToOne(() => User, (user) => user.password, {
    nullable: false,
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}

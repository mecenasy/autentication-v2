import { Provider } from 'src/libs/utils/provider';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SocialConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  name: string;

  @Column({
    type: 'enum',
    enum: Provider,
    unique: true,
    nullable: false,
  })
  provider: Provider;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  clientId: string;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  secret: string;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  callbackUrl: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  active: boolean;
}

import { IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity('users-details')
export class UserDetails {
  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  name: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  surname: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  street: string;

  @Column({
    name: 'zip_code',
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  zipCode: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  city: string;

  @Column({
    name: 'street_number',
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  streetNumber: string;

  @Column({
    type: 'varchar',
    length: 60,
    nullable: false,
  })
  @IsString()
  state: string;

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
}

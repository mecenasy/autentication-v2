import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProject1772891915618 implements MigrationInterface {
  name = 'UpdateProject1772891915618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "project_auth" DROP COLUMN "origin"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD "origin" character varying(255) NOT NULL`,
    );
  }
}

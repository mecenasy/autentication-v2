import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProject31772900317663 implements MigrationInterface {
  name = 'UpdateProject31772900317663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_auth" ALTER COLUMN "hash" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ALTER COLUMN "salt" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_auth" ALTER COLUMN "salt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ALTER COLUMN "hash" DROP NOT NULL`,
    );
  }
}

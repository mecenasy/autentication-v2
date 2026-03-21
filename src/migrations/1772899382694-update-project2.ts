import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProject21772899382694 implements MigrationInterface {
  name = 'UpdateProject21772899382694';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_auth" DROP CONSTRAINT "UQ_2afa84272c75533b5e4537f18c0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" DROP COLUMN "client_secret"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD "hash" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD CONSTRAINT "UQ_cb75b9542491e7bb424c07ad0a6" UNIQUE ("hash")`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD "salt" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD CONSTRAINT "UQ_8187075ff231adf65c903b26d6d" UNIQUE ("salt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_auth" DROP CONSTRAINT "UQ_8187075ff231adf65c903b26d6d"`,
    );
    await queryRunner.query(`ALTER TABLE "project_auth" DROP COLUMN "salt"`);
    await queryRunner.query(
      `ALTER TABLE "project_auth" DROP CONSTRAINT "UQ_cb75b9542491e7bb424c07ad0a6"`,
    );
    await queryRunner.query(`ALTER TABLE "project_auth" DROP COLUMN "hash"`);
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD "client_secret" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD CONSTRAINT "UQ_2afa84272c75533b5e4537f18c0" UNIQUE ("client_secret")`,
    );
  }
}

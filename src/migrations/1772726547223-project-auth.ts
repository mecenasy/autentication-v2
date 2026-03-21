import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectAuth1772726547223 implements MigrationInterface {
  name = 'ProjectAuth1772726547223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "project_auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "client_id" uuid NOT NULL, "client_secret" character varying(255) NOT NULL, "client_url" character varying(255) NOT NULL, "origin" character varying(255) NOT NULL, "is_activated" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" uuid NOT NULL, CONSTRAINT "UQ_14cba7e7e2043f4a07f93113f8c" UNIQUE ("client_id"), CONSTRAINT "UQ_2afa84272c75533b5e4537f18c0" UNIQUE ("client_secret"), CONSTRAINT "PK_de510fd6b9f3c0fd09ec8974a6c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_auth" ADD CONSTRAINT "FK_8865cf5673ce13072fdf44119cb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "project_auth" DROP CONSTRAINT "FK_8865cf5673ce13072fdf44119cb"`,
    );
    await queryRunner.query(`DROP TABLE "project_auth"`);
  }
}

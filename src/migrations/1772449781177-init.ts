import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1772449781177 implements MigrationInterface {
  name = 'Init1772449781177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "password" ("userId" uuid NOT NULL, "hash" character varying(100) NOT NULL, "salt" character varying(100) NOT NULL, "is_default_password" boolean NOT NULL DEFAULT true, "is_two_factor_enabled" boolean NOT NULL DEFAULT false, "two_factor_secret" character varying(100), CONSTRAINT "PK_dc877602e08545367e6f85b02e5" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_accounts_provider_enum" AS ENUM('microsoft', 'google', 'facebook', 'apple', 'github', 'linkedin', 'twitter')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" "public"."social_accounts_provider_enum" NOT NULL, "providerId" character varying(100) NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_e9e58d2d8e9fafa20af914d9750" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pass-key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "credential_id" character varying NOT NULL, "publicKey" bytea NOT NULL, "counter" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "devicename" character varying, "userId" uuid NOT NULL, CONSTRAINT "UQ_6ef3ad3e0c3ed49e0ba7d0cc057" UNIQUE ("credential_id"), CONSTRAINT "PK_cf3d69e38006176fa4189ff2622" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(60) NOT NULL, "phone" character varying(15), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "admin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_config_provider_enum" AS ENUM('microsoft', 'google', 'facebook', 'apple', 'github', 'linkedin', 'twitter')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "provider" "public"."social_config_provider_enum" NOT NULL, "clientId" character varying NOT NULL, "secret" character varying NOT NULL, "callbackUrl" character varying, "active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_2b260ca2cde3caf62d85492c240" UNIQUE ("name"), CONSTRAINT "UQ_86c1835c4b11bdd98f9b99a605d" UNIQUE ("provider"), CONSTRAINT "UQ_20c12cd2639e537281088a47488" UNIQUE ("clientId"), CONSTRAINT "UQ_de63f57554bbaaf2ae7b79c8b9c" UNIQUE ("secret"), CONSTRAINT "UQ_fa1ef1f7ad32c460f628926e7c9" UNIQUE ("callbackUrl"), CONSTRAINT "PK_478e36ae3fc8857e863a9b6548e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "password" ADD CONSTRAINT "FK_dc877602e08545367e6f85b02e5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_accounts" ADD CONSTRAINT "FK_7de933c3670ec71c68aca0afd56" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pass-key" ADD CONSTRAINT "FK_52db8a0e7519b88e522e0a07da5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pass-key" DROP CONSTRAINT "FK_52db8a0e7519b88e522e0a07da5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_accounts" DROP CONSTRAINT "FK_7de933c3670ec71c68aca0afd56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "password" DROP CONSTRAINT "FK_dc877602e08545367e6f85b02e5"`,
    );
    await queryRunner.query(`DROP TABLE "social_config"`);
    await queryRunner.query(`DROP TYPE "public"."social_config_provider_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "pass-key"`);
    await queryRunner.query(`DROP TABLE "social_accounts"`);
    await queryRunner.query(
      `DROP TYPE "public"."social_accounts_provider_enum"`,
    );
    await queryRunner.query(`DROP TABLE "password"`);
  }
}

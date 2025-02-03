import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1738603989201 implements MigrationInterface {
    name = 'Initial1738603989201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TenantUser" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sso_user_id" character varying(32) NOT NULL, "role" character varying(15) NOT NULL, "created_datetime" TIMESTAMP NOT NULL DEFAULT now(), "updated_datetime" TIMESTAMP NOT NULL DEFAULT now(), "tenant_id" uuid, CONSTRAINT "PK_d8ca94ab78d13b325c78de120cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_633012d40ec0c41f5957a51e22" ON "TenantUser" ("sso_user_id") `);
        await queryRunner.query(`CREATE TABLE "Tenant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "created_datetime" TIMESTAMP NOT NULL DEFAULT now(), "updated_datetime" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_cebe9e163fad8d1d82343a48fba" UNIQUE ("name"), CONSTRAINT "PK_9ba54ddd56ce80e5b2d7523b6be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "TenantUser" ADD CONSTRAINT "FK_11edd3c26961777406c54e6d90c" FOREIGN KEY ("tenant_id") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "TenantUser" DROP CONSTRAINT "FK_11edd3c26961777406c54e6d90c"`);
        await queryRunner.query(`DROP TABLE "Tenant"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_633012d40ec0c41f5957a51e22"`);
        await queryRunner.query(`DROP TABLE "TenantUser"`);
    }

}

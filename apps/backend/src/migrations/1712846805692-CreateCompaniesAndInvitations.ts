import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCompaniesAndInvitations1712846805692
  implements MigrationInterface
{
  name = 'CreateCompaniesAndInvitations1712846805692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "batch_entity" DROP CONSTRAINT "FK_76cb8d9bfefa4fe71c2986db6a0"`
    );
    await queryRunner.query(
      `CREATE TABLE "invitation_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "emailToInvite" character varying NOT NULL, "companyId" uuid, CONSTRAINT "UQ_262c7b65b0a44bfe7aca01c3e18" UNIQUE ("emailToInvite"), CONSTRAINT "PK_e5ae23b2f2922f2ae65f10b3709" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "company_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "VAT" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_4fa349c84e0f59fd552170735e0" UNIQUE ("VAT"), CONSTRAINT "PK_ad727d0b2b2f9bc3f78fff1b19a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "company_vat_index" ON "company_entity" ("VAT") `
    );
    await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "ownerId"`);
    await queryRunner.query(
      `ALTER TABLE "batch_entity" ADD "parentLotNumber" character varying`
    );
    await queryRunner.query(`ALTER TABLE "batch_entity" ADD "companyId" uuid`);
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "companyId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "batch_entity" ADD CONSTRAINT "FK_0c90568fc06efc45469e62cf4b1" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_entity" ADD CONSTRAINT "FK_b1267472406586eeecfa3af8fe4" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" ADD CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP CONSTRAINT "FK_d78ff9c278b60cd0cc82907d2d4"`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_entity" DROP CONSTRAINT "FK_b1267472406586eeecfa3af8fe4"`
    );
    await queryRunner.query(
      `ALTER TABLE "batch_entity" DROP CONSTRAINT "FK_0c90568fc06efc45469e62cf4b1"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_entity" DROP COLUMN "companyId"`
    );
    await queryRunner.query(
      `ALTER TABLE "batch_entity" DROP COLUMN "companyId"`
    );
    await queryRunner.query(
      `ALTER TABLE "batch_entity" DROP COLUMN "parentLotNumber"`
    );
    await queryRunner.query(`ALTER TABLE "batch_entity" ADD "ownerId" uuid`);
    await queryRunner.query(`DROP INDEX "public"."company_vat_index"`);
    await queryRunner.query(`DROP TABLE "company_entity"`);
    await queryRunner.query(`DROP TABLE "invitation_entity"`);
    await queryRunner.query(
      `ALTER TABLE "batch_entity" ADD CONSTRAINT "FK_76cb8d9bfefa4fe71c2986db6a0" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class LatestUpdates1713788117360 implements MigrationInterface {
    name = 'LatestUpdates1713788117360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP CONSTRAINT "PK_9ea2ee8df13bed30f40933e55f1"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP CONSTRAINT "FK_0c90568fc06efc45469e62cf4b1"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD CONSTRAINT "PK_756081b94e3c1a7eb5cd6dc8c94" PRIMARY KEY ("lotNumber")`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP CONSTRAINT "UQ_756081b94e3c1a7eb5cd6dc8c94"`);
        await queryRunner.query(`ALTER TYPE "public"."batch_entity_status_enum" RENAME TO "batch_entity_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."batch_entity_status_enum" AS ENUM('pending', 'accepted', 'declined')`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ALTER COLUMN "status" TYPE "public"."batch_entity_status_enum" USING "status"::"text"::"public"."batch_entity_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."batch_entity_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ALTER COLUMN "companyId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD CONSTRAINT "FK_0c90568fc06efc45469e62cf4b1" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD CONSTRAINT "FK_a2364e3c97d185849d6d6b6ebc1" FOREIGN KEY ("parentLotNumber") REFERENCES "batch_entity"("lotNumber") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP CONSTRAINT "FK_a2364e3c97d185849d6d6b6ebc1"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP CONSTRAINT "FK_0c90568fc06efc45469e62cf4b1"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ALTER COLUMN "companyId" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."batch_entity_status_enum_old" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ALTER COLUMN "status" TYPE "public"."batch_entity_status_enum_old" USING "status"::"text"::"public"."batch_entity_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."batch_entity_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."batch_entity_status_enum_old" RENAME TO "batch_entity_status_enum"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD CONSTRAINT "UQ_756081b94e3c1a7eb5cd6dc8c94" UNIQUE ("lotNumber")`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP CONSTRAINT "PK_756081b94e3c1a7eb5cd6dc8c94"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD CONSTRAINT "FK_0c90568fc06efc45469e62cf4b1" FOREIGN KEY ("companyId") REFERENCES "company_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD CONSTRAINT "PK_9ea2ee8df13bed30f40933e55f1" PRIMARY KEY ("id")`);
    }

}

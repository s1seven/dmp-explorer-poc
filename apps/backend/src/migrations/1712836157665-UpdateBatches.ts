import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBatches1712836157665 implements MigrationInterface {
    name = 'UpdateBatches1712836157665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "quantity" integer NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."batch_entity_unit_enum" AS ENUM('kg', 'to', 'm')`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "unit" "public"."batch_entity_unit_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "unit"`);
        await queryRunner.query(`DROP TYPE "public"."batch_entity_unit_enum"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "quantity"`);
    }

}

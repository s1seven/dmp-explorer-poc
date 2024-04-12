import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToBatches1712920767138 implements MigrationInterface {
    name = 'AddStatusToBatches1712920767138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."batch_entity_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "status" "public"."batch_entity_status_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."batch_entity_status_enum"`);
    }

}

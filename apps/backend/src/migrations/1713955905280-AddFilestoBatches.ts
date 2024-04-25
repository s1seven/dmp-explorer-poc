import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilestoBatches1713955905280 implements MigrationInterface {
    name = 'AddFilestoBatches1713955905280'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "hasJson" boolean`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "hasPDF" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "hasPDF"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "hasJson"`);
    }

}

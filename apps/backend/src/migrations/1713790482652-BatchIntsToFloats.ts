import { MigrationInterface, QueryRunner } from "typeorm";

export class BatchIntsToFloats1713790482652 implements MigrationInterface {
    name = 'BatchIntsToFloats1713790482652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "leadContent"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "leadContent" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "mercuryContent"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "mercuryContent" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "cadmiumContent"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "cadmiumContent" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "cadmiumContent"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "cadmiumContent" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "mercuryContent"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "mercuryContent" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "batch_entity" DROP COLUMN "leadContent"`);
        await queryRunner.query(`ALTER TABLE "batch_entity" ADD "leadContent" integer NOT NULL`);
    }

}

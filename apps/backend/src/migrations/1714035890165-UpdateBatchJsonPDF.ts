import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateBatchJsonPDF1714035890165 implements MigrationInterface {
  name = 'UpdateBatchJsonPDF1714035890165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('batch_entity', 'hasJson', 'json');
    await queryRunner.renameColumn('batch_entity', 'hasPDF', 'PDF');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('batch_entity', 'json', 'hasJson');
    await queryRunner.renameColumn('batch_entity', 'PDF', 'hasPDF');
  }
}

import { Logger } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

export async function runInTransaction<T = void>(
  action: (qr: QueryRunner) => Promise<T>,
  dataSource: DataSource,
  logger = new Logger()
): Promise<T> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const result = await action(queryRunner);
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    logger.warn(`Transaction ended with error: ${error.message}`);
    if (queryRunner.isTransactionActive) {
      logger.warn(`Rolling back transaction...`);
      await queryRunner.rollbackTransaction();
    }
    throw error;
  } finally {
    await queryRunner.release();
  }
}

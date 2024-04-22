import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1712761023143 implements MigrationInterface {
  name = 'InitialMigration1712761023143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "batch_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "lotNumber" character varying NOT NULL, "leadContent" integer NOT NULL, "mercuryContent" integer NOT NULL, "cadmiumContent" integer NOT NULL, "isRoHSCompliant" boolean NOT NULL, "ownerId" uuid, CONSTRAINT "UQ_756081b94e3c1a7eb5cd6dc8c94" UNIQUE ("lotNumber"), CONSTRAINT "PK_9ea2ee8df13bed30f40933e55f1" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "user_email_index" ON "user_entity" ("email") `
    );
    await queryRunner.query(
      `ALTER TABLE "batch_entity" ADD CONSTRAINT "FK_76cb8d9bfefa4fe71c2986db6a0" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "batch_entity" DROP CONSTRAINT "FK_76cb8d9bfefa4fe71c2986db6a0"`
    );
    await queryRunner.query(`DROP INDEX "public"."user_email_index"`);
    await queryRunner.query(`DROP TABLE "user_entity"`);
    await queryRunner.query(`DROP TABLE "batch_entity"`);
  }
}

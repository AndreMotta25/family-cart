import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUserAddLoginSituation1704912309053
  implements MigrationInterface
{
  name = 'AlterTableUserAddLoginSituation1704912309053';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "login" character varying NOT NULL DEFAULT 'internal'`,
    );
    await queryRunner.query(
      `ALTER TABLE "Lists" DROP CONSTRAINT "FK_301f1d62211e6a35af3a86ecc92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Lists" ALTER COLUMN "ownerId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Lists" ADD CONSTRAINT "FK_301f1d62211e6a35af3a86ecc92" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Lists" DROP CONSTRAINT "FK_301f1d62211e6a35af3a86ecc92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Lists" ALTER COLUMN "ownerId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "Lists" ADD CONSTRAINT "FK_301f1d62211e6a35af3a86ecc92" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "login"`);
  }
}

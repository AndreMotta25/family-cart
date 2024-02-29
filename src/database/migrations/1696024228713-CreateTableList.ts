import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableList1696024228713 implements MigrationInterface {
  name = 'CreateTableList1696024228713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Lists" ("id" character varying NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "ownerId" character varying, CONSTRAINT "PK_4e62951b606984356e12e3188a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Lists" ADD CONSTRAINT "FK_301f1d62211e6a35af3a86ecc92" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Lists" DROP CONSTRAINT "FK_301f1d62211e6a35af3a86ecc92"`,
    );
    await queryRunner.query(`DROP TABLE "Lists"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTablePendingList1696987567267 implements MigrationInterface {
  name = 'CreateTablePendingList1696987567267';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PendingList" ("id" character varying NOT NULL, "guestId" character varying NOT NULL, "ownerId" character varying NOT NULL, "listId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8d8d7779fa29357bf52bbf62745" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "PendingList" ADD CONSTRAINT "FK_bfe6c522a18a0307b7b17b77570" FOREIGN KEY ("guestId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PendingList" ADD CONSTRAINT "FK_8ad8afbbae7d0504da1a9651e62" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PendingList" ADD CONSTRAINT "FK_f9e15883c35308abe781cb0e78a" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PendingList" DROP CONSTRAINT "FK_f9e15883c35308abe781cb0e78a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PendingList" DROP CONSTRAINT "FK_8ad8afbbae7d0504da1a9651e62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PendingList" DROP CONSTRAINT "FK_bfe6c522a18a0307b7b17b77570"`,
    );
    await queryRunner.query(`DROP TABLE "PendingList"`);
  }
}

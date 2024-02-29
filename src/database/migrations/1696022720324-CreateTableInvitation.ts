import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableInvitation1696022720324 implements MigrationInterface {
  name = 'CreateTableInvitation1696022720324';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Invitation" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "userPendingId" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_80f7ae92e12cd6390f95821c430" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invitation" ADD CONSTRAINT "FK_e9977400d6e71e3756f137d4e52" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invitation" ADD CONSTRAINT "FK_34a83b2a5295b69aa901c4a4ca0" FOREIGN KEY ("userPendingId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Invitation" DROP CONSTRAINT "FK_34a83b2a5295b69aa901c4a4ca0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Invitation" DROP CONSTRAINT "FK_e9977400d6e71e3756f137d4e52"`,
    );
    await queryRunner.query(`DROP TABLE "Invitation"`);
  }
}

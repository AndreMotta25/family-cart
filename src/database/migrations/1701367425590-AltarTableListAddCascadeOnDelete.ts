import { MigrationInterface, QueryRunner } from 'typeorm';

export class AltarTableListAddCascadeOnDelete1701367425590
  implements MigrationInterface
{
  name = 'AltarTableListAddCascadeOnDelete1701367425590';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SharedList" DROP CONSTRAINT "FK_9c6ed885a98757bf5df768432d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SharedList" ADD CONSTRAINT "FK_9c6ed885a98757bf5df768432d7" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "SharedList" DROP CONSTRAINT "FK_9c6ed885a98757bf5df768432d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "SharedList" ADD CONSTRAINT "FK_9c6ed885a98757bf5df768432d7" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

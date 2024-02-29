import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableItemAddCascadeDelete1696786589074
  implements MigrationInterface
{
  name = 'AlterTableItemAddCascadeDelete1696786589074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Itens" DROP CONSTRAINT "FK_55622b0e77797c6f55c5ba6f8a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Itens" ADD CONSTRAINT "FK_55622b0e77797c6f55c5ba6f8a7" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Itens" DROP CONSTRAINT "FK_55622b0e77797c6f55c5ba6f8a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Itens" ADD CONSTRAINT "FK_55622b0e77797c6f55c5ba6f8a7" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

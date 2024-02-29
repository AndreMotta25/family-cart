import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableItemAddUrl1696786814174 implements MigrationInterface {
    name = 'AlterTableItemAddUrl1696786814174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Itens" ADD "url" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Itens" DROP COLUMN "url"`);
    }

}

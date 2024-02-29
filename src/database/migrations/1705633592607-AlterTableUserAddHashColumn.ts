import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUserAddHashColumn1705633592607 implements MigrationInterface {
    name = 'AlterTableUserAddHashColumn1705633592607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "hash" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "hash"`);
    }

}

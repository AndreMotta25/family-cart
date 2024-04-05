import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableAddColumnCidAndAvatar1710808431538 implements MigrationInterface {
    name = 'AlterTableAddColumnCidAndAvatar1710808431538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "cid" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "cid"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "avatar"`);
    }

}

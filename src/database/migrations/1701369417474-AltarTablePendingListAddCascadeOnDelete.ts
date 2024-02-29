import { MigrationInterface, QueryRunner } from "typeorm";

export class AltarTablePendingListAddCascadeOnDelete1701369417474 implements MigrationInterface {
    name = 'AltarTablePendingListAddCascadeOnDelete1701369417474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PendingList" DROP CONSTRAINT "FK_f9e15883c35308abe781cb0e78a"`);
        await queryRunner.query(`ALTER TABLE "PendingList" ADD CONSTRAINT "FK_f9e15883c35308abe781cb0e78a" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PendingList" DROP CONSTRAINT "FK_f9e15883c35308abe781cb0e78a"`);
        await queryRunner.query(`ALTER TABLE "PendingList" ADD CONSTRAINT "FK_f9e15883c35308abe781cb0e78a" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

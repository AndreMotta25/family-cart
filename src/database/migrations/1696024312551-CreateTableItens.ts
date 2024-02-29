import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableItens1696024312551 implements MigrationInterface {
    name = 'CreateTableItens1696024312551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Itens" ("id" character varying NOT NULL, "name" character varying NOT NULL, "quantity" integer NOT NULL, "listId" character varying, CONSTRAINT "PK_07e63f5dc5948ad236653cfb40a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Itens" ADD CONSTRAINT "FK_55622b0e77797c6f55c5ba6f8a7" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Itens" DROP CONSTRAINT "FK_55622b0e77797c6f55c5ba6f8a7"`);
        await queryRunner.query(`DROP TABLE "Itens"`);
    }

}

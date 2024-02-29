import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserAndFamilyMembers1696022638348 implements MigrationInterface {
    name = 'CreateTableUserAndFamilyMembers1696022638348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "FamilyMembers" ("id" character varying NOT NULL, "userId" character varying NOT NULL, "kinId" character varying NOT NULL, CONSTRAINT "PK_2390bb90bff5036d18b8efd50a9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "FamilyMembers" ADD CONSTRAINT "FK_57d39e4ad64830935fec2ee0c94" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "FamilyMembers" ADD CONSTRAINT "FK_b058c5217780f97270798133c2d" FOREIGN KEY ("kinId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FamilyMembers" DROP CONSTRAINT "FK_b058c5217780f97270798133c2d"`);
        await queryRunner.query(`ALTER TABLE "FamilyMembers" DROP CONSTRAINT "FK_57d39e4ad64830935fec2ee0c94"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "FamilyMembers"`);
    }

}

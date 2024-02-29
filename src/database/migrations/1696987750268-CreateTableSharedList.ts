import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableSharedList1696987750268 implements MigrationInterface {
    name = 'CreateTableSharedList1696987750268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "SharedList" ("id" character varying NOT NULL, "listId" character varying NOT NULL, "ownerId" character varying NOT NULL, "additionalUserId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3d26f20926f9988c3bcba280c3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "SharedList" ADD CONSTRAINT "FK_9c6ed885a98757bf5df768432d7" FOREIGN KEY ("listId") REFERENCES "Lists"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SharedList" ADD CONSTRAINT "FK_85a28edd20d9f72fa66370acb1b" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "SharedList" ADD CONSTRAINT "FK_0f571033fc90b8b0608cbd95afd" FOREIGN KEY ("additionalUserId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SharedList" DROP CONSTRAINT "FK_0f571033fc90b8b0608cbd95afd"`);
        await queryRunner.query(`ALTER TABLE "SharedList" DROP CONSTRAINT "FK_85a28edd20d9f72fa66370acb1b"`);
        await queryRunner.query(`ALTER TABLE "SharedList" DROP CONSTRAINT "FK_9c6ed885a98757bf5df768432d7"`);
        await queryRunner.query(`DROP TABLE "SharedList"`);
    }

}

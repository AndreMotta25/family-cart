import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletingFamilyMembers1731374956948 implements MigrationInterface {
  name = 'DeletingFamilyMembers1731374956948';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "UsersFriends" ("user_id" character varying NOT NULL, "friend_id" character varying NOT NULL, CONSTRAINT "PK_d37e09b9d334af5f815fea8c429" PRIMARY KEY ("user_id", "friend_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26a0c61aa896da9c3991834aea" ON "UsersFriends" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9dda52b5551602b20e3290b61d" ON "UsersFriends" ("friend_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "UsersFriends" ADD CONSTRAINT "FK_26a0c61aa896da9c3991834aeaa" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "UsersFriends" ADD CONSTRAINT "FK_9dda52b5551602b20e3290b61df" FOREIGN KEY ("friend_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UsersFriends" DROP CONSTRAINT "FK_9dda52b5551602b20e3290b61df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UsersFriends" DROP CONSTRAINT "FK_26a0c61aa896da9c3991834aeaa"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9dda52b5551602b20e3290b61d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_26a0c61aa896da9c3991834aea"`,
    );
    await queryRunner.query(`DROP TABLE "UsersFriends"`);
  }
}

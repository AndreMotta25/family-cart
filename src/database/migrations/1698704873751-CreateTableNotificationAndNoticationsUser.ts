import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableNotificationAndNoticationsUser1698704873751
  implements MigrationInterface
{
  name = 'CreateTableNotificationAndNoticationsUser1698704873751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Notifications" ("id" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "entity_id" character varying NOT NULL, "entity_name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c77268afe7d3c5568da66c5bebe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Notifications_User" ("id" character varying NOT NULL, "emitterId" character varying NOT NULL, "receptorId" character varying NOT NULL, "notificationId" character varying, CONSTRAINT "PK_0df17e135746f4d436a41a7f368" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications_User" ADD CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3" FOREIGN KEY ("notificationId") REFERENCES "Notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications_User" ADD CONSTRAINT "FK_d4f66945d592e9f23d017e4ab2c" FOREIGN KEY ("emitterId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications_User" ADD CONSTRAINT "FK_a20da36f88ad42733780d9a05cc" FOREIGN KEY ("receptorId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Notifications_User" DROP CONSTRAINT "FK_a20da36f88ad42733780d9a05cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications_User" DROP CONSTRAINT "FK_d4f66945d592e9f23d017e4ab2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Notifications_User" DROP CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3"`,
    );
    await queryRunner.query(`DROP TABLE "Notifications_User"`);
    await queryRunner.query(`DROP TABLE "Notifications"`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableNotifyChangeColumnCreatedAt1707364235897 implements MigrationInterface {
    name = 'AlterTableNotifyChangeColumnCreatedAt1707364235897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Notifications_User" DROP CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3"`);
        await queryRunner.query(`ALTER TABLE "Notifications_User" ALTER COLUMN "notificationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Notifications" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "Notifications" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Notifications_User" ADD CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3" FOREIGN KEY ("notificationId") REFERENCES "Notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Notifications_User" DROP CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3"`);
        await queryRunner.query(`ALTER TABLE "Notifications" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "Notifications" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "Notifications_User" ALTER COLUMN "notificationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Notifications_User" ADD CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3" FOREIGN KEY ("notificationId") REFERENCES "Notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

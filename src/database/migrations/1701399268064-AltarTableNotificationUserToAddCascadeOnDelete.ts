import { MigrationInterface, QueryRunner } from "typeorm";

export class AltarTableNotificationUserToAddCascadeOnDelete1701399268064 implements MigrationInterface {
    name = 'AltarTableNotificationUserToAddCascadeOnDelete1701399268064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Notifications_User" DROP CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3"`);
        await queryRunner.query(`ALTER TABLE "Notifications_User" ADD CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3" FOREIGN KEY ("notificationId") REFERENCES "Notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Notifications_User" DROP CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3"`);
        await queryRunner.query(`ALTER TABLE "Notifications_User" ADD CONSTRAINT "FK_09f085e3c51e376eeff7dca33d3" FOREIGN KEY ("notificationId") REFERENCES "Notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

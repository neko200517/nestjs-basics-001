import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsrIdColumn1717909912159 implements MigrationInterface {
    name = 'AddUsrIdColumn1717909912159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15"`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15"`);
        await queryRunner.query(`ALTER TABLE "items" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

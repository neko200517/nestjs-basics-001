import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelation1717909118828 implements MigrationInterface {
    name = 'AddRelation1717909118828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT "FK_40e681891fea5a4b3c5c2546d15"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "userId"`);
    }

}

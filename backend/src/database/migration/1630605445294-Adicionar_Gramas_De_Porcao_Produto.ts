import {MigrationInterface, QueryRunner} from "typeorm";

export class AdicionarGramasDePorcaoProduto1630605445294 implements MigrationInterface {
    name = 'AdicionarGramasDePorcaoProduto1630605445294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."produto" ADD "gramas_porcao" real NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."produto" DROP COLUMN "gramas_porcao"`);
    }

}

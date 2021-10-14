import {MigrationInterface, QueryRunner} from "typeorm";

export class CriarSugestao1634232724434 implements MigrationInterface {
    name = 'CriarSugestao1634232724434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sugestao" ("codigo" character varying NOT NULL, "data_primeira_sugestao" TIMESTAMP NOT NULL, "vezes_sugeridas" integer NOT NULL, CONSTRAINT "PK_dbef2d2ada4608154125d610fa2" PRIMARY KEY ("codigo"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sugestao"`);
    }

}

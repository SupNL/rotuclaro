import {MigrationInterface, QueryRunner} from "typeorm";

export class AdicionarMLPerfilProduto1633546973897 implements MigrationInterface {
    name = 'AdicionarMLPerfilProduto1633546973897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."produto" DROP COLUMN "gramas_porcao"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "ml" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."produto" ADD "gramas_ou_ml_porcao" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."produto" ADD "liquido" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."produto" DROP COLUMN "liquido"`);
        await queryRunner.query(`ALTER TABLE "public"."produto" DROP COLUMN "gramas_ou_ml_porcao"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "ml"`);
        await queryRunner.query(`ALTER TABLE "public"."produto" ADD "gramas_porcao" real NOT NULL`);
    }

}

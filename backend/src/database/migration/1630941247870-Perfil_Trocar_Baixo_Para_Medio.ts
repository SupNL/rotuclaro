import {MigrationInterface, QueryRunner} from "typeorm";

export class PerfilTrocarBaixoParaMedio1630941247870 implements MigrationInterface {
    name = 'PerfilTrocarBaixoParaMedio1630941247870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_kcal"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_carboidratos"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_acucares"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_gorduras_totais"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_gorduras_trans"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_gorduras_saturadas"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_sodio"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_medio_kcal" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_medio_carboidratos" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_medio_acucares" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_medio_gorduras_totais" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_medio_gorduras_trans" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_medio_gorduras_saturadas" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_medio_sodio" real NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_medio_sodio"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_medio_gorduras_saturadas"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_medio_gorduras_trans"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_medio_gorduras_totais"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_medio_acucares"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_medio_carboidratos"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" DROP COLUMN "limite_medio_kcal"`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_baixo_sodio" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_baixo_gorduras_saturadas" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_baixo_gorduras_trans" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_baixo_gorduras_totais" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_baixo_acucares" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_baixo_carboidratos" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "public"."perfil" ADD "limite_baixo_kcal" real NOT NULL`);
    }

}

import {MigrationInterface, QueryRunner} from 'typeorm';

export class AtualizarCamposPerfil1630939705145 implements MigrationInterface {
    name = 'AtualizarCamposPerfil1630939705145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_kcal"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_carboidratos"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_acucares"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_gorduras_totais"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_gorduras_trans"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_gorduras_saturadas"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_sodio"');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_baixo_kcal" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_alto_kcal" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_baixo_carboidratos" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_alto_carboidratos" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_baixo_acucares" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_alto_acucares" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_baixo_gorduras_totais" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_alto_gorduras_totais" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_baixo_gorduras_trans" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_alto_gorduras_trans" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_baixo_gorduras_saturadas" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_alto_gorduras_saturadas" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_baixo_sodio" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_alto_sodio" real NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_alto_sodio"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_sodio"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_alto_gorduras_saturadas"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_gorduras_saturadas"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_alto_gorduras_trans"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_gorduras_trans"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_alto_gorduras_totais"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_gorduras_totais"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_alto_acucares"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_acucares"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_alto_carboidratos"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_carboidratos"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_alto_kcal"');
        await queryRunner.query('ALTER TABLE "public"."perfil" DROP COLUMN "limite_baixo_kcal"');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_sodio" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_gorduras_saturadas" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_gorduras_trans" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_gorduras_totais" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_acucares" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_carboidratos" real NOT NULL');
        await queryRunner.query('ALTER TABLE "public"."perfil" ADD "limite_kcal" real NOT NULL');
    }

}

import {MigrationInterface, QueryRunner} from 'typeorm';

export class AdicionarUsuarioAtivo1630603233701 implements MigrationInterface {
    name = 'AdicionarUsuarioAtivo1630603233701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."usuario" ADD "ativo" boolean NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "public"."usuario" DROP COLUMN "ativo"');
    }

}

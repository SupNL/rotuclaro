import {MigrationInterface, QueryRunner} from "typeorm";

export class AdicionarDefaultNoAtivo1630607304088 implements MigrationInterface {
    name = 'AdicionarDefaultNoAtivo1630607304088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "ativo" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."usuario" ALTER COLUMN "ativo" DROP DEFAULT`);
    }

}

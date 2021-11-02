import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeNaTabelaRegistro1635860432118 implements MigrationInterface {
    name = 'CascadeNaTabelaRegistro1635860432118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."registro_consulta" DROP CONSTRAINT "FK_879ac3a5f057f48cd3dd154c930"`);
        await queryRunner.query(`ALTER TABLE "public"."registro_consulta" ALTER COLUMN "data_consulta" SET DEFAULT 'NOW()'`);
        await queryRunner.query(`ALTER TABLE "public"."registro_consulta" ADD CONSTRAINT "FK_879ac3a5f057f48cd3dd154c930" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."registro_consulta" DROP CONSTRAINT "FK_879ac3a5f057f48cd3dd154c930"`);
        await queryRunner.query(`ALTER TABLE "public"."registro_consulta" ALTER COLUMN "data_consulta" SET DEFAULT '2021-10-21 23:43:28.28712'`);
        await queryRunner.query(`ALTER TABLE "public"."registro_consulta" ADD CONSTRAINT "FK_879ac3a5f057f48cd3dd154c930" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

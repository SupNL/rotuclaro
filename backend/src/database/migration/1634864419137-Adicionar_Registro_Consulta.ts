import {MigrationInterface, QueryRunner} from "typeorm";

export class AdicionarRegistroConsulta1634864419137 implements MigrationInterface {
    name = 'AdicionarRegistroConsulta1634864419137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "registro_consulta" ("id" SERIAL NOT NULL, "data_consulta" TIMESTAMP NOT NULL DEFAULT 'NOW()', "id_produto" integer NOT NULL, CONSTRAINT "REL_879ac3a5f057f48cd3dd154c93" UNIQUE ("id_produto"), CONSTRAINT "PK_7bc8a0523b417dc8d9cafb745ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "registro_consulta" ADD CONSTRAINT "FK_879ac3a5f057f48cd3dd154c930" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "registro_consulta" DROP CONSTRAINT "FK_879ac3a5f057f48cd3dd154c930"`);
        await queryRunner.query(`DROP TABLE "registro_consulta"`);
    }

}

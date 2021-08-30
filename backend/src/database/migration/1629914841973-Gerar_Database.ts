import {MigrationInterface, QueryRunner} from 'typeorm';

export class GerarDatabase1629914841973 implements MigrationInterface {
    name = 'GerarDatabase1629914841973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "componente_alergenico" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, CONSTRAINT "PK_d357faeb4006f56540f6505c10e" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TYPE "usuario_nivel_enum" AS ENUM(\'0\', \'2\', \'5\')');
        await queryRunner.query('CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nome" character varying NOT NULL, "login" character varying NOT NULL, "senha" character varying NOT NULL, "nivel" "usuario_nivel_enum" NOT NULL DEFAULT \'5\', "id_perfil" integer, CONSTRAINT "UQ_59bc805e13413e4be83be3a7752" UNIQUE ("login"), CONSTRAINT "REL_a2fb58aab02985cc8264cd3b03" UNIQUE ("id_perfil"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "perfil" ("id" SERIAL NOT NULL, "gramas" integer NOT NULL, "limite_kcal" real NOT NULL, "limite_carboidratos" real NOT NULL, "limite_acucares" real NOT NULL, "limite_gorduras_totais" real NOT NULL, "limite_gorduras_trans" real NOT NULL, "limite_gorduras_saturadas" real NOT NULL, "limite_sodio" real NOT NULL, "id_usuario" integer NOT NULL, CONSTRAINT "REL_4f728b134716ee028b716f84cd" UNIQUE ("id_usuario"), CONSTRAINT "PK_814c50101bf1675e1f691aad2c9" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "produto" ("id" SERIAL NOT NULL, "codigo" character varying NOT NULL, "nome" character varying NOT NULL, "kcal" real NOT NULL, "carboidratos" real NOT NULL, "acucares" real NOT NULL, "gorduras" real NOT NULL, "gorduras_trans" real NOT NULL, "gorduras_saturadas" real NOT NULL, "sodio" real NOT NULL, "proteinas" real NOT NULL, "fibras" real NOT NULL, "ingredientes" character varying NOT NULL, CONSTRAINT "UQ_25c3d3b4470aed83c75ea778953" UNIQUE ("codigo"), CONSTRAINT "PK_99c4351f9168c50c0736e6a66be" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "componentes_perfis" ("id_perfil" integer NOT NULL, "id_componente" integer NOT NULL, CONSTRAINT "PK_a071f9a0b153f9b2f6b6486df55" PRIMARY KEY ("id_perfil", "id_componente"))');
        await queryRunner.query('CREATE INDEX "IDX_f22722eec85c57700755e7d159" ON "componentes_perfis" ("id_perfil") ');
        await queryRunner.query('CREATE INDEX "IDX_d8a80aceea0375871c2f21f8c8" ON "componentes_perfis" ("id_componente") ');
        await queryRunner.query('CREATE TABLE "componentes_produtos" ("id_produto" integer NOT NULL, "id_componente" integer NOT NULL, CONSTRAINT "PK_361effa221dd06691831f740122" PRIMARY KEY ("id_produto", "id_componente"))');
        await queryRunner.query('CREATE INDEX "IDX_25685bd555a3c6e2b390673861" ON "componentes_produtos" ("id_produto") ');
        await queryRunner.query('CREATE INDEX "IDX_fcedbbe1400f57a1b4c73cc8fe" ON "componentes_produtos" ("id_componente") ');
        await queryRunner.query('ALTER TABLE "usuario" ADD CONSTRAINT "FK_a2fb58aab02985cc8264cd3b034" FOREIGN KEY ("id_perfil") REFERENCES "perfil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "perfil" ADD CONSTRAINT "FK_4f728b134716ee028b716f84cdf" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "componentes_perfis" ADD CONSTRAINT "FK_f22722eec85c57700755e7d159c" FOREIGN KEY ("id_perfil") REFERENCES "perfil"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "componentes_perfis" ADD CONSTRAINT "FK_d8a80aceea0375871c2f21f8c84" FOREIGN KEY ("id_componente") REFERENCES "componente_alergenico"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "componentes_produtos" ADD CONSTRAINT "FK_25685bd555a3c6e2b3906738615" FOREIGN KEY ("id_produto") REFERENCES "produto"("id") ON DELETE CASCADE ON UPDATE CASCADE');
        await queryRunner.query('ALTER TABLE "componentes_produtos" ADD CONSTRAINT "FK_fcedbbe1400f57a1b4c73cc8fee" FOREIGN KEY ("id_componente") REFERENCES "componente_alergenico"("id") ON DELETE CASCADE ON UPDATE CASCADE');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "componentes_produtos" DROP CONSTRAINT "FK_fcedbbe1400f57a1b4c73cc8fee"');
        await queryRunner.query('ALTER TABLE "componentes_produtos" DROP CONSTRAINT "FK_25685bd555a3c6e2b3906738615"');
        await queryRunner.query('ALTER TABLE "componentes_perfis" DROP CONSTRAINT "FK_d8a80aceea0375871c2f21f8c84"');
        await queryRunner.query('ALTER TABLE "componentes_perfis" DROP CONSTRAINT "FK_f22722eec85c57700755e7d159c"');
        await queryRunner.query('ALTER TABLE "perfil" DROP CONSTRAINT "FK_4f728b134716ee028b716f84cdf"');
        await queryRunner.query('ALTER TABLE "usuario" DROP CONSTRAINT "FK_a2fb58aab02985cc8264cd3b034"');
        await queryRunner.query('DROP INDEX "IDX_fcedbbe1400f57a1b4c73cc8fe"');
        await queryRunner.query('DROP INDEX "IDX_25685bd555a3c6e2b390673861"');
        await queryRunner.query('DROP TABLE "componentes_produtos"');
        await queryRunner.query('DROP INDEX "IDX_d8a80aceea0375871c2f21f8c8"');
        await queryRunner.query('DROP INDEX "IDX_f22722eec85c57700755e7d159"');
        await queryRunner.query('DROP TABLE "componentes_perfis"');
        await queryRunner.query('DROP TABLE "produto"');
        await queryRunner.query('DROP TABLE "perfil"');
        await queryRunner.query('DROP TABLE "usuario"');
        await queryRunner.query('DROP TYPE "usuario_nivel_enum"');
        await queryRunner.query('DROP TABLE "componente_alergenico"');
    }

}

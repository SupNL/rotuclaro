import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity({ name: 'sugestao' })
export class Sugestao {
    constructor(codigo?: string) {
        this.codigo = codigo;
    }

    @BeforeInsert()
    criarSugestao() : void {
        this.dataPrimeiraSugestao = new Date();
    }

    @Column({ primary: true, type: 'varchar', name: 'codigo', nullable: false })
    codigo: string;

    @Column({
        type : 'timestamp',
        name : 'data_primeira_sugestao',
        nullable : false,
    })
    dataPrimeiraSugestao : Date;

    @Column({
        type: 'int',
        name: 'vezes_sugeridas',
        nullable: false,
    })
    vezesSugeridas: number;
}

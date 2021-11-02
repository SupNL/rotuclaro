import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from './Produto';

@Entity({ name : 'registro_consulta' })
export class RegistroConsulta {
    constructor(produto ?: Produto) {
        this.produto = produto;
    }

    @PrimaryGeneratedColumn({ name : 'id' })
    id : number;

    @Column({
        type: 'timestamp',
        name: 'data_consulta',
        default : 'NOW()',
        nullable: false,
    })
    dataConsulta : Date;

    @ManyToOne(() => Produto, {
        nullable: false, onDelete : 'CASCADE'
    })
    @JoinColumn({ name: 'id_produto' })
    produto: Produto;
}
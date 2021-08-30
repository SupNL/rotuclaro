import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ComponenteAlergenico } from './ComponenteAlergenico';

@Entity({ name: 'produto' })
export class Produto {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({
        type: 'varchar',
        unique: true,
        name: 'codigo',
        nullable: false,
    })
    codigo: string;

    @Column({
        type: 'varchar',
        name: 'nome',
        nullable: false,
    })
    nome: string;

    @Column({
        type: 'real',
        name: 'kcal',
        nullable: false,
    })
    kcal: number;

    @Column({
        type: 'real',
        name: 'carboidratos',
        nullable: false,
    })
    carboidratos: number;

    @Column({
        type: 'real',
        name: 'acucares',
        nullable: false,
    })
    acucares: number;

    @Column({
        type: 'real',
        name: 'gorduras',
        nullable: false,
    })
    gorduras: number;

    @Column({
        type: 'real',
        name: 'gorduras_trans',
        nullable: false,
    })
    gordurasTrans: number;

    @Column({
        type: 'real',
        name: 'gorduras_saturadas',
        nullable: false,
    })
    gordurasSaturadas: number;

    @Column({
        type: 'real',
        name: 'sodio',
        nullable: false,
    })
    sodio: number;

    @Column({
        type: 'real',
        name: 'proteinas',
        nullable: false,
    })
    proteinas: number;

    @Column({
        type: 'real',
        name: 'fibras',
        nullable: false,
    })
    fibras: number;

    @Column({
        type: 'varchar',
        name: 'ingredientes',
        nullable: false,
    })
    ingredientes: string;

    @ManyToMany(() => ComponenteAlergenico)
    @JoinTable({
        name: 'componentes_produtos',
        joinColumn: {
            name: 'id_produto',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'id_componente',
            referencedColumnName: 'id',
        }
    })
    componentesAlergenicos : ComponenteAlergenico[]
}

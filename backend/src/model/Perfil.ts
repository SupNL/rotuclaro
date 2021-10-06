import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ComponenteAlergenico } from './ComponenteAlergenico';
import { Usuario } from './Usuario';

@Entity({ name: 'perfil' })
export class Perfil {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({
        type: 'int',
        name: 'gramas',
        nullable: false,
    })
    gramas: number;

    @Column({
        type: 'int',
        name: 'ml',
        nullable: false,
    })
    ml: number;

    @Column({
        type: 'real',
        name: 'limite_medio_kcal',
        nullable: false,
    })
    limiteMedioKcal: number;

    @Column({
        type: 'real',
        name: 'limite_alto_kcal',
        nullable: false,
    })
    limiteAltoKcal: number;

    @Column({
        type: 'real',
        name: 'limite_medio_carboidratos',
        nullable: false,
    })
    limiteMedioCarboidratos: number;

    @Column({
        type: 'real',
        name: 'limite_alto_carboidratos',
        nullable: false,
    })
    limiteAltoCarboidratos: number;

    @Column({
        type: 'real',
        name: 'limite_medio_acucares',
        nullable: false,
    })
    limiteMedioAcucares: number;

    @Column({
        type: 'real',
        name: 'limite_alto_acucares',
        nullable: false,
    })
    limiteAltoAcucares: number;

    @Column({
        type: 'real',
        name: 'limite_medio_gorduras_totais',
        nullable: false,
    })
    limiteMedioGordurasTotais: number;

    @Column({
        type: 'real',
        name: 'limite_alto_gorduras_totais',
        nullable: false,
    })
    limiteAltoGordurasTotais: number;

    @Column({
        type: 'real',
        name: 'limite_medio_gorduras_trans',
        nullable: false,
    })
    limiteMedioGordurasTrans: number;

    @Column({
        type: 'real',
        name: 'limite_alto_gorduras_trans',
        nullable: false,
    })
    limiteAltoGordurasTrans: number;

    @Column({
        type: 'real',
        name: 'limite_medio_gorduras_saturadas',
        nullable: false,
    })
    limiteMedioGordurasSaturadas: number;

    @Column({
        type: 'real',
        name: 'limite_alto_gorduras_saturadas',
        nullable: false,
    })
    limiteAltoGordurasSaturadas: number;

    @Column({
        type: 'real',
        name: 'limite_medio_sodio',
        nullable: false,
    })
    limiteMedioSodio: number;

    @Column({
        type: 'real',
        name: 'limite_alto_sodio',
        nullable: false,
    })
    limiteAltoSodio: number;

    @ManyToMany(() => ComponenteAlergenico, { eager : true })
    @JoinTable({
        name: 'componentes_perfis',
        joinColumn: {
            name: 'id_perfil',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'id_componente',
            referencedColumnName: 'id',
        },
    })
    componentesAlergenicos: ComponenteAlergenico[];

    @OneToOne(() => Usuario, (usuario) => usuario.perfil, {
        nullable: false,
    })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;
}

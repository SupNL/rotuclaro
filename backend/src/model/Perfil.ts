import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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
        type: 'real',
        name: 'limite_kcal',
        nullable: false,
    })
    limiteKcal: number;

    @Column({
        type: 'real',
        name: 'limite_carboidratos',
        nullable: false,
    })
    limiteCarboidratos: number;

    @Column({
        type: 'real',
        name: 'limite_acucares',
        nullable: false,
    })
    limiteAcucares: number;

    @Column({
        type: 'real',
        name: 'limite_gorduras_totais',
        nullable: false,
    })
    limiteGordurasTotais: number;

    @Column({
        type: 'real',
        name: 'limite_gorduras_trans',
        nullable: false,
    })
    limiteGordurasTrans: number;

    @Column({
        type: 'real',
        name: 'limite_gorduras_saturadas',
        nullable: false,
    })
    limiteGordurasSaturadas: number;

    @Column({
        type: 'real',
        name: 'limite_sodio',
        nullable: false,
    })
    limiteSodio: number;

    @ManyToMany(() => ComponenteAlergenico)
    @JoinTable({
        name: 'componentes_perfis',
        joinColumn: {
            name: 'id_perfil',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'id_componente',
            referencedColumnName: 'id',
        }
    })
    componentesAlergenicos : ComponenteAlergenico[]

    @OneToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: 'id_usuario' })
    usuario: Usuario;
}

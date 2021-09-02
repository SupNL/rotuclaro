import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Perfil } from './Perfil';

export enum NivelUsuario {
    ADMIN = 0,
    MODERADOR = 2,
    COMUM = 5,
}

@Entity({ name: 'usuario' })
export class Usuario {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({
        type: 'varchar',
        name: 'nome',
        nullable: false,
    })
    nome: string;

    @Column({
        type: 'varchar',
        name: 'login',
        unique: true,
        nullable: false,
    })
    login: string;

    @Column({
        type: 'varchar',
        name: 'senha',
        nullable: false,
    })
    senha: string;

    @Column({
        type: 'bool',
        name: 'ativo',
        nullable : false,
    })
    ativo : boolean;

    @Column({
        type: 'enum',
        enum: NivelUsuario,
        default: NivelUsuario.COMUM,
    })
    nivel: NivelUsuario;

    @OneToOne(() => Perfil)
    @JoinColumn({ name: 'id_perfil' })
    perfil: Perfil;
}

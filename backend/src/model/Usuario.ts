import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcryptjs';

import { Perfil } from './Perfil';

export enum NivelUsuario {
    ADMIN = 0,
    MODERADOR = 2,
    COMUM = 5,
}

@Entity({ name: 'usuario' })
export class Usuario {
    constructor(nome?: string) {
        this.nome = nome;
    }

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        this.senha = await hash(this.senha, 10);
    }

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
        select: false,
    })
    login: string;

    @Column({
        type: 'varchar',
        name: 'senha',
        nullable: false,
        select: false,
    })
    senha: string;

    @Column({
        type: 'bool',
        name: 'ativo',
        nullable: false,
        default: true,
        select: false,
    })
    ativo: boolean;

    @Column({
        type: 'enum',
        enum: NivelUsuario,
        default: NivelUsuario.COMUM,
    })
    nivel: NivelUsuario;

    @OneToOne(() => Perfil, (perfil) => perfil.usuario)
    @JoinColumn({ name: 'id_perfil' })
    perfil: Perfil;
}

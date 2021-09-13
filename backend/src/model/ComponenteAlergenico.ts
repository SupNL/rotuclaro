import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name : 'componente_alergenico' })
export class ComponenteAlergenico {
    constructor(nome ?: string) {
        this.nome = nome;
    }

    @PrimaryGeneratedColumn({ name : 'id' })
    id : number;

    @Column({
        type : 'varchar',
        name : 'nome',
        nullable: false,
    })
    nome : string;
}
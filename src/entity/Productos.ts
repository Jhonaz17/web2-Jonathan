import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Productos {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, nullable: false })
    nombre: string;
    @Column()
    precio: number;
    @Column()
    stock: number;
    @Column()
    categoria: number;
    @Column({default:1})
    estado: boolean;
}

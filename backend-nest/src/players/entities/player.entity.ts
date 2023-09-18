import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// set fields needed obbligatory

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email:string;

  @Column()
  password:string;
}
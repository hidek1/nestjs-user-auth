import 'reflect-metadata';

import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IUser } from './user.interface';

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn("uuid")
    id?: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    token: string;

    @CreateDateColumn()
    readonly createdAt?: Date;

    @UpdateDateColumn()
    readonly updatedAt?: Date;

    constructor(token: string, name: string) {
      this.name = name;
      this.token = "";
    }
}
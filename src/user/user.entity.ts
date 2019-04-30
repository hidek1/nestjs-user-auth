import 'reflect-metadata';

import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IUser } from './user.interface';

@Entity()
export class User implements IUser {
    @Column()
    name: string;

    @PrimaryColumn()
    email: string;

    @Column()
    password: string;

    @Column()
    token: string;
}
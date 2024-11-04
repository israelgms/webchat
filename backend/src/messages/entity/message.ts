import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  text: string;

  @Column()
  time: string;

  @Column()
  channel: string;
}

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  industry: string;

  @Column()
  employee_count: string;

  @Column()
  website: string;
}
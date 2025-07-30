import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity('portfolio_files')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;
  
  @Column({ type: 'text', nullable: false })
  filename: string;

  @Column({ name: 'file_url', type: 'text', nullable: false })
  fileUrl: string;

  @Column({ name: 'file_type', type: 'text', nullable: true })
  fileType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
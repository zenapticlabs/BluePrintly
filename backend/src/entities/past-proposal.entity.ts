import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('past_proposals')
export class PastProposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  filename: string;

  @Column({ name: 'file_url', type: 'text' })
  fileUrl: string;


  @Column({ name: 'content_json', type: 'jsonb', nullable: true })
  contentJson: any;

  @Column({ type: 'text', default: 'pending' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
} 
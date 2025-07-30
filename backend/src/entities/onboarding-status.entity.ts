import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type OnboardingStep = 'company' | 'past-proposals' | 'portfolio';
export type StepStatus = 'not_started' | 'in_progress' | 'completed';

@Entity()
export class OnboardingStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  })
  companyStatus: StepStatus;

  @Column({
    type: 'enum',
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  })
  pastProposalsStatus: StepStatus;

  @Column({
    type: 'enum',
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  })
  portfolioStatus: StepStatus;

  @Column({
    type: 'enum',
    enum: ['company', 'past-proposals', 'portfolio'],
    default: 'company'
  })
  currentStep: OnboardingStep;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
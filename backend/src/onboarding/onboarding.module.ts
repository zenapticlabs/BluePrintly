import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { PastProposal } from 'src/entities/past-proposal.entity';
import { Portfolio } from 'src/entities/portfolio.entity';
import { OnboardingStatus } from 'src/entities/onboarding-status.entity';
import { SharedModule } from 'src/shared/shared.module';
import { BullModule } from '@nestjs/bull';
import { PastProposalProcessingProcessor } from './past-proposal-processing.processor';
import { DocumentsModule } from 'src/documents/documents.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, PastProposal, Portfolio, OnboardingStatus]),
    BullModule.registerQueue({
      name: 'past-proposal-processing',
    }),
    SharedModule,
    DocumentsModule,
    FilesModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, PastProposalProcessingProcessor],
})
export class OnboardingModule { }

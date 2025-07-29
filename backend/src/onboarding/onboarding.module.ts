import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { PastProposal } from 'src/entities/past-proposal.entity';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, PastProposal]),
    SharedModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule { }

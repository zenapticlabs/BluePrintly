import { Body, Controller, Post, UploadedFiles, UseInterceptors, Get, Param } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OnboardingService } from './onboarding.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PastProposalUploadDto } from './dto/past-proposal-upload.dto';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
  ) { }

  @Post('company')
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.onboardingService.createCompany(createCompanyDto);
    return company;
  }

  @Post('past-proposals')

  async uploadPastProposals(
    @Body() pastProposalUploadDto: PastProposalUploadDto
  ) {
    return await this.onboardingService.uploadPastProposals(pastProposalUploadDto);
  }
}

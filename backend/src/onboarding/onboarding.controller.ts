import { Body, Controller, Post } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateCompanyDto } from './dto/create-company.dto';

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
}

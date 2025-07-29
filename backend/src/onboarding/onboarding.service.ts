import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OnboardingService {

    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) { }

    async createCompany(createCompanyDto: CreateCompanyDto) {
        const company = this.companyRepository.create({
            user_id: createCompanyDto.userId,
            name: createCompanyDto.name,
            type: createCompanyDto.type,
            industry: createCompanyDto.industry,
            employee_count: createCompanyDto.employeeCount,
            website: createCompanyDto.website,
        });
        return await this.companyRepository.save(company);
    }
}

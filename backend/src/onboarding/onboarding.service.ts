import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PastProposalUploadDto } from './dto/past-proposal-upload.dto';
import { PortfolioUploadDto } from './dto/portfolio-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { PastProposal } from 'src/entities/past-proposal.entity';
import { Repository } from 'typeorm';
import { SupabaseStorageService } from 'src/shared/services/supabase-storage.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Portfolio } from 'src/entities/portfolio.entity';
import { OnboardingStatus, OnboardingStep, StepStatus } from 'src/entities/onboarding-status.entity';

@Injectable()
export class OnboardingService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(PastProposal)
        private pastProposalRepository: Repository<PastProposal>,
        @InjectRepository(Portfolio)
        private portfolioRepository: Repository<Portfolio>,
        @InjectRepository(OnboardingStatus)
        private onboardingStatusRepository: Repository<OnboardingStatus>,
        private supabaseStorageService: SupabaseStorageService,
        @InjectQueue('past-proposal-processing')
        private pastProposalQueue: Queue,
    ) { }

    private async getOrCreateOnboardingStatus(userId: string): Promise<OnboardingStatus> {
        let status = await this.onboardingStatusRepository.findOne({
            where: { userId }
        });

        if (!status) {
            status = new OnboardingStatus();
            status.userId = userId;
            status = await this.onboardingStatusRepository.save(status);
        }

        return status;
    }

    private async updateOnboardingStep(userId: string, step: OnboardingStep, stepStatus: StepStatus) {
        const status = await this.getOrCreateOnboardingStatus(userId);
        
        // Update the specific step status
        switch (step) {
            case 'company':
                status.companyStatus = stepStatus;
                break;
            case 'past-proposals':
                status.pastProposalsStatus = stepStatus;
                break;
            case 'portfolio':
                status.portfolioStatus = stepStatus;
                break;
        }

        // Update current step if needed
        if (stepStatus === 'completed') {
            if (step === 'company' && status.currentStep === 'company') {
                status.currentStep = 'past-proposals';
            } else if (step === 'past-proposals' && status.currentStep === 'past-proposals') {
                status.currentStep = 'portfolio';
            } else if (step === 'portfolio') {
                status.isCompleted = true;
            }
        }

        return await this.onboardingStatusRepository.save(status);
    }

    async getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
        return await this.getOrCreateOnboardingStatus(userId);
    }

    async createCompany(createCompanyDto: CreateCompanyDto) {
        // Update status to in_progress
        await this.updateOnboardingStep(createCompanyDto.userId, 'company', 'in_progress');

        const company = new Company();
        company.user_id = createCompanyDto.userId;
        company.name = createCompanyDto.name;
        company.type = createCompanyDto.type;
        company.industry = createCompanyDto.industry;
        company.employee_count = createCompanyDto.employeeCount;
        company.website = createCompanyDto.website;

        const savedCompany = await this.companyRepository.save(company);

        // Update status to completed
        await this.updateOnboardingStep(createCompanyDto.userId, 'company', 'completed');

        return savedCompany;
    }

    async uploadPastProposals(pastProposalUploadData: PastProposalUploadDto) {
        // Update status to in_progress
        await this.updateOnboardingStep(pastProposalUploadData.userId, 'past-proposals', 'in_progress');

        const jobIds: string[] = [];
        const createdProposals: PastProposal[] = [];

        // Process each URL
        for (const url of pastProposalUploadData.urls) {
            try {
                // Create past_proposals entry with 'pending' status
                const pastProposal = new PastProposal();
                pastProposal.userId = pastProposalUploadData.userId;
                                 pastProposal.filename = url.split('/').pop() || 'unknown';
                 pastProposal.fileUrl = url;
                 pastProposal.status = 'pending';

                const savedProposal = await this.pastProposalRepository.save(pastProposal);
                createdProposals.push(savedProposal);

                // 3. Generate job ID for background processing tracking
                const jobId = `job_${savedProposal.id}_${Date.now()}`;
                jobIds.push(jobId);

                // 4. Trigger background processing job
                await this.pastProposalQueue.add('process-past-proposal', {
                    proposalId: savedProposal.id,
                    fileUrl: url,
                    fileName: url.split('/').pop() || 'unknown',
                }, {
                    jobId: jobId,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                });

                console.log(`Queued processing job ${jobId} for proposal ${savedProposal.id}`);

            } catch (error) {
                console.error(`Failed to process URL ${url}:`, error);
                // Continue processing other files even if one fails
            }
        }

        // Update status to completed since we've queued all files for processing
        await this.updateOnboardingStep(pastProposalUploadData.userId, 'past-proposals', 'completed');

        return {
            userId: pastProposalUploadData.userId,
            processedFiles: createdProposals.length,
            jobIds,
            proposals: createdProposals.map(proposal => ({
                id: proposal.id,
                filename: proposal.filename,
                status: proposal.status,
                createdAt: proposal.createdAt
            }))
        };
    }

    async getPastProposalsByUser(userId: string) {
        return await this.pastProposalRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }
        });
    }

    async getPastProposalStatus(proposalId: string) {
        return await this.pastProposalRepository.findOne({
            where: { id: proposalId },
            select: ['id', 'filename', 'status', 'createdAt']
        });
    }

    async getPastProposalContent(proposalId: string) {
        const proposal = await this.pastProposalRepository.findOne({
            where: { id: proposalId },
        });

        if (!proposal) {
            throw new Error('Past proposal not found');
        }

        if (proposal.status !== 'completed') {
            throw new Error('Past proposal processing not completed yet');
        }

        return {
            id: proposal.id,
            filename: proposal.filename,
            contentJson: proposal.contentJson,
            status: proposal.status,
            createdAt: proposal.createdAt
        };
    }

    async uploadPortfolio(portfolioUploadDto: PortfolioUploadDto) {
        // Update status to in_progress
        await this.updateOnboardingStep(portfolioUploadDto.userId, 'portfolio', 'in_progress');

        const createdPortfolios: Portfolio[] = [];

        // Process each file info
        for (const fileInfo of portfolioUploadDto.urls) {
            try {
                // Create portfolio entry
                const portfolio = new Portfolio();
                portfolio.userId = portfolioUploadDto.userId;
                portfolio.filename = fileInfo.filename;
                portfolio.fileUrl = fileInfo.fileUrl;
                portfolio.fileType = fileInfo.fileType;

                const savedPortfolio = await this.portfolioRepository.save(portfolio);
                createdPortfolios.push(savedPortfolio);

                console.log(`Created portfolio entry ${savedPortfolio.id}`);

            } catch (error) {
                console.error(`Failed to process file ${fileInfo.filename}:`, error);
                // Continue processing other files even if one fails
            }
        }

        // Update status to completed
        await this.updateOnboardingStep(portfolioUploadDto.userId, 'portfolio', 'completed');

        return {
            userId: portfolioUploadDto.userId,
            processedFiles: createdPortfolios.length,
            portfolios: createdPortfolios.map(portfolio => ({
                id: portfolio.id,
                filename: portfolio.filename,
                fileUrl: portfolio.fileUrl,
                fileType: portfolio.fileType,
                createdAt: portfolio.createdAt
            }))
        };
    }
}

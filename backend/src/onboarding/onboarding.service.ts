import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PastProposalUploadDto } from './dto/past-proposal-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { PastProposal } from 'src/entities/past-proposal.entity';
import { Repository } from 'typeorm';
import { SupabaseStorageService } from 'src/shared/services/supabase-storage.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class OnboardingService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(PastProposal)
        private pastProposalRepository: Repository<PastProposal>,
        private supabaseStorageService: SupabaseStorageService,
        @InjectQueue('past-proposal-processing')
        private pastProposalQueue: Queue,
    ) { }

    async createCompany(createCompanyDto: CreateCompanyDto) {
        const company = new Company();
        company.user_id = createCompanyDto.userId;
        company.name = createCompanyDto.name;
        company.type = createCompanyDto.type;
        company.industry = createCompanyDto.industry;
        company.employee_count = createCompanyDto.employeeCount;
        company.website = createCompanyDto.website;

        return await this.companyRepository.save(company);
    }

    async uploadPastProposals(pastProposalUploadData: PastProposalUploadDto) {
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
}

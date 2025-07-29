import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { PastProposalUploadDto } from './dto/past-proposal-upload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { PastProposal } from 'src/entities/past-proposal.entity';
import { Repository } from 'typeorm';
import { SupabaseStorageService } from 'src/shared/services/supabase-storage.service';

@Injectable()
export class OnboardingService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
        @InjectRepository(PastProposal)
        private pastProposalRepository: Repository<PastProposal>,
        private supabaseStorageService: SupabaseStorageService,
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

        console.log(pastProposalUploadData);
        // Process each file
        for (const file of pastProposalUploadData.files) {
            try {
                // 1. Upload file to Supabase Storage
                const fileName = `${Date.now()}-${file.originalname}`;
                const fileUrl = await this.supabaseStorageService.uploadFile(
                    file.buffer,
                    fileName,
                    'past-proposals'
                );

                // 2. Create past_proposals entry with 'pending' status
                const pastProposal = new PastProposal();
                pastProposal.userId = pastProposalUploadData.userId;
                pastProposal.filename = file.originalname;
                pastProposal.fileUrl = fileUrl;
                pastProposal.fileType = file.mimetype;
                pastProposal.fileSize = file.size;
                pastProposal.status = 'pending';

                const savedProposal = await this.pastProposalRepository.save(pastProposal);
                createdProposals.push(savedProposal);

                // 3. Generate job ID for background processing tracking
                const jobId = `job_${savedProposal.id}_${Date.now()}`;
                jobIds.push(jobId);

                // TODO: 4. Trigger background processing job
                // This would typically involve:
                // - Queuing a job with a job queue (Bull, BullMQ, etc.)
                // - The job would process the document content
                // - Update the past_proposal record with processed content_json
                // - Update status to 'completed' or 'failed'
                
                console.log(`Queued processing job ${jobId} for proposal ${savedProposal.id}`);

            } catch (error) {
                console.error(`Failed to process file ${file.originalname}:`, error);
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
}

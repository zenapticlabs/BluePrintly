import { Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { PastProposal } from "src/entities/past-proposal.entity";
import { Repository } from "typeorm";
import { SupabaseStorageService } from "src/shared/services/supabase-storage.service";
import { ConverterService } from "src/documents/services/converter.service";
import { XmlProcessorService } from "src/documents/services/xml-processor.service";

@Injectable()
@Processor('past-proposal-processing')
export class PastProposalProcessingProcessor {
    constructor(
        @InjectRepository(PastProposal)
        private pastProposalRepository: Repository<PastProposal>,
        private converterService: ConverterService,
        private xmlProcessorService: XmlProcessorService,
        private supabaseStorageService: SupabaseStorageService,
    ) { }

    @Process('process-past-proposal')
    async processPastProposal(job: Job) {
        try {
            const { proposalId, fileUrl, fileName } = job.data;

            // Update status to processing
            await this.pastProposalRepository.update(proposalId, {
                status: 'processing'
            });

            // Download the file from Supabase
            const fileData = await this.supabaseStorageService.downloadFile('past-proposals', fileName);

            // Create a File-like object that matches Express.Multer.File
            const fileObject = {
                buffer: fileData,
                originalname: fileName,
                mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                size: fileData.length
            } as Express.Multer.File;

            const convertedOdt = await this.converterService.convertToOdt(fileObject);

            // Extract metadata from ODT
            // const metadata = await this.converterService.extractMetadataFromOdt(convertedOdt);

            // Extract XML content from ODT
            const contentXml = await this.converterService.extractXmlFromOdt(convertedOdt);
            // Convert XML to JSON directly without writing to file
            const jsonData = await this.xmlProcessorService.parseXmlToJson(contentXml);

            // Get the proposal
            const proposal = await this.pastProposalRepository.findOne({
                where: { id: proposalId }
            });

            if (!proposal) {
                throw new Error('Proposal not found');
            }

            // Update the proposal with processed content
            proposal.status = 'completed';
            proposal.contentJson = jsonData;

            await this.pastProposalRepository.save(proposal);

            return { success: true, proposalId };
        } catch (error) {
            console.error('Error processing proposal:', error);

            // Update proposal status to failed
            if (job.data.proposalId) {
                await this.pastProposalRepository.update(job.data.proposalId, {
                    status: 'failed'
                });
            }

            throw error; // Rethrow to let Bull handle retries
        }
    }
}
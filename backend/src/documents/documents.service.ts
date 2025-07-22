import { Injectable } from '@nestjs/common';
import * as JSZip from 'jszip';
import * as fs from 'fs';
import * as xml2js from 'xml2js';
import { ConfigService } from '@nestjs/config';
import { XmlProcessorService } from './services/xml-processor.service';
import { ConverterService } from './services/converter.service';
import { SupabaseService } from '../shared/services/supabase.service';

@Injectable()
export class DocumentsService {
    constructor(
        private configService: ConfigService,
        private xmlProcessorService: XmlProcessorService,
        private converterService: ConverterService,
        private supabaseService: SupabaseService
    ) {}

    async processDocument(file: Express.Multer.File) {
        try {
            // Upload original file to Supabase
            const originalFileName = `original_${Date.now()}_${file.originalname}`;
            const originalUrl = await this.supabaseService.uploadFile(
                file.buffer,
                originalFileName,
                'documents'
            );

            // First convert DOCX to ODT
            const convertedOdt = await this.converterService.convertToOdt(file);

            // Extract metadata from ODT
            const metadata = await this.converterService.extractMetadataFromOdt(convertedOdt);

            // Extract XML content from ODT
            const contentXml = await this.converterService.extractXmlFromOdt(convertedOdt);

            fs.writeFileSync('content.xml', contentXml);
            // Convert XML to JSON
            const jsonData = await this.xmlProcessorService.parseXmlToJson(contentXml);

            fs.writeFileSync('json.json', JSON.stringify(jsonData, null, 2));

            const processedJson = await this.processJsonByAI(jsonData);

            const modifiedXml = await this.xmlProcessorService.parseJsonToXml(processedJson);

            fs.writeFileSync('modified.xml', modifiedXml);
            // Convert modified XML back to DOCX
            const docxBuffer = await this.converterService.convertToDocx(convertedOdt, modifiedXml);

            // Upload modified file to Supabase
            const modifiedFileName = `modified_${Date.now()}_${file.originalname}`;
            const modifiedUrl = await this.supabaseService.uploadFile(
                docxBuffer,
                modifiedFileName,
                'documents'
            );

            return {
                success: true,
                docx: docxBuffer.toString('base64'),
                originalUrl,
                modifiedUrl,
                metadata // Include metadata in the response
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to modify DOCX through XML'
            };
        }
    }

    async processJsonByAI(json: any) {
        // TODO: Implement AI processing
        // Process the json data by AI
        return json
    }
}

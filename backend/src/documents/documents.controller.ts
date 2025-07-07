import { Controller, Post, UploadedFile, UseInterceptors, Body, Res } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('process')
    @UseInterceptors(FileInterceptor('file'))
    async processDocument(@UploadedFile() file: Express.Multer.File) {
        const response = await this.documentsService.processDocument(file);
        return response;
    }
}

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConversionResult, DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ConversionResult> {
        const result = await this.documentsService.convertDocxToHtml(file.buffer);
        return result;
    }
}

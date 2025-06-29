import { Controller, Post, UploadedFile, UseInterceptors, Body, Res } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

// Define the DTO for process endpoint
class ProcessDocumentDto {
    mode: 'XML' | 'HTML';
    download: string;
}

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return await this.documentsService.processDocxFile(file);
    }

    @Post('process')
    @UseInterceptors(FileInterceptor('file'))
    async processDocument(
        @UploadedFile() file: Express.Multer.File,
        @Body() processOptions: ProcessDocumentDto,
        @Res() res: Response
    ) {
        let result;

        if (processOptions.mode === 'XML') {
            result = await this.documentsService.modifyDocxThroughXml(file);
        } else {
            result = await this.documentsService.modifyDocxThroughHtml(file);
        }

        if (result.success) {
            if (processOptions.download === "true" && result.docx) {
                // Set headers for DOCX download
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                res.setHeader('Content-Disposition', `attachment; filename="converted.docx"`);
                return res.send(result.docx);
            } else {
                // Return the XML or HTML content based on mode
                return res.json({
                    success: true,
                    content: processOptions.mode === 'XML' ? result.xml : result.html,
                    docx: result.docx.toString('base64') // Convert buffer to base64 string
                });
            }
        }

        return res.json(result);
    }
}

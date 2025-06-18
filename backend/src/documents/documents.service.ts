import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';

export interface ConversionResult {
    content: string;
    messages: any[];
}

@Injectable()
export class DocumentsService {
    async convertDocxToHtml(buffer: Buffer): Promise<ConversionResult> {
        try {
            const result = await mammoth.convertToHtml({ buffer });
            return {
                content: result.value,
                messages: result.messages
            }
        } catch (error) {
            throw new Error(`Failed to convert DOCX: ${error.message}`);
        }
    }
}

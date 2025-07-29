import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { ConfigModule } from '@nestjs/config';
import { XmlProcessorService } from './services/xml-processor.service';
import { ConverterService } from './services/converter.service';

@Module({
  imports: [ConfigModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, XmlProcessorService, ConverterService],
  exports: [DocumentsService, XmlProcessorService, ConverterService]
})
export class DocumentsModule {}

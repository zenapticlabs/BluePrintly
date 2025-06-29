import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import * as libre from 'libreoffice-convert';
import { join } from 'path';
import { exec } from 'child_process';
import * as JSZip from 'jszip';
import { promises as fs } from 'fs';
const execPromise = promisify(exec);
const libreConvert = promisify(libre.convert);

@Injectable()
export class DocumentsService {
    async processDocxFile(file: Express.Multer.File) {
        try {
            const ext = '.odt';
            const outputPath = join(__dirname, '..', 'converted', file.originalname.replace('.docx', ext));

            const converted = await new Promise<Buffer>((resolve, reject) => {
                libre.convert(file.buffer, ext, undefined, (err, done) => {
                    if (err) return reject(err);
                    resolve(done);
                });
            });

            await fs.mkdir(join(__dirname, '..', 'converted'), { recursive: true });
            await fs.writeFile(outputPath, converted);

            return outputPath;
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Unknown error occurred during document processing'
            };
        }
    }

    async convertOdtToHtml(odtBuffer: Buffer): Promise<string> {
        try {
            // Create temporary directories for input and output
            const tempDir = join(__dirname, '..', 'temp');
            const inputDir = join(tempDir, 'input');
            const outputDir = join(tempDir, 'output');

            // Ensure directories exist
            await fs.mkdir(tempDir, { recursive: true });
            await fs.mkdir(inputDir, { recursive: true });
            await fs.mkdir(outputDir, { recursive: true });

            // Write ODT buffer to a temporary file
            const tempOdtPath = join(inputDir, 'temp.odt');
            await fs.writeFile(tempOdtPath, odtBuffer);

            // Convert ODT to HTML using LibreOffice CLI
            const outputHtmlPath = join(outputDir, 'temp.html');
            await execPromise(`soffice --headless --convert-to html --outdir "${outputDir}" "${tempOdtPath}"`);

            // Read the generated HTML
            let htmlContent = await fs.readFile(outputHtmlPath, 'utf-8');

            // Clean up temporary files
            await fs.rm(tempDir, { recursive: true, force: true });

            return htmlContent;
        } catch (error) {
            throw new Error(`Failed to convert ODT to HTML: ${error.message}`);
        }
    }

    async convertModifiedXmlToDocx(modifiedXml: string, originalOdtBuffer: Buffer): Promise<Buffer> {
        try {
            // Create a new ZIP with the modified content.xml
            const zip = new JSZip();

            // Load the original ODT to get all other files
            const originalZip = await JSZip.loadAsync(originalOdtBuffer);

            // Copy all files from original ODT except content.xml
            for (const [fileName, file] of Object.entries(originalZip.files)) {
                if (fileName !== 'content.xml' && !file.dir) {
                    const content = await file.async('uint8array');
                    zip.file(fileName, content);
                }
            }

            // Add the modified content.xml
            zip.file('content.xml', modifiedXml);

            // Generate the new ODT buffer
            const newOdtBuffer = await zip.generateAsync({ type: 'nodebuffer' });

            // Convert ODT to DOCX using LibreOffice
            const docxBuffer = await libreConvert(newOdtBuffer, '.docx', undefined);

            return docxBuffer;
        } catch (error) {
            throw new Error(`Failed to convert modified XML to DOCX: ${error.message}`);
        }
    }


    async modifyDocxThroughXml(file: Express.Multer.File) {
        try {
            // First convert DOCX to ODT
            const converted = await this.getConvertDocumentToOdt(file);

            // Write the converted buffer to test.odt
            const testPath = join(__dirname, '..', '..', 'test.odt');
            await fs.writeFile(testPath, converted);

            // Extract XML content from ODT
            const zip = new JSZip();
            const odtContents = await zip.loadAsync(converted);
            const contentXmlFile = odtContents.file('content.xml');

            if (!contentXmlFile) {
                throw new Error('Could not find content.xml in the ODT file');
            }

            const contentXml = await contentXmlFile.async('string');

            // Write the XML to test.xml
            const testXmlPath = join(__dirname, '..', '..', 'test.xml');
            await fs.writeFile(testXmlPath, contentXml);

            // Replace "Terrible" with "Best" and save to test2.xml
            const modifiedXml = contentXml.replace(/Project Description/g, 'Project Description 2');
            const test2XmlPath = join(__dirname, '..', '..', 'test2.xml');
            await fs.writeFile(test2XmlPath, modifiedXml);

            // Convert modified XML back to DOCX
            const docxBuffer = await this.convertModifiedXmlToDocx(modifiedXml, converted);

            return {
                success: true,
                xml: modifiedXml,
                docx: docxBuffer
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to modify DOCX through XML'
            };
        }
    }

    async modifyDocxThroughHtml(file: Express.Multer.File) {
        try {
            // First convert DOCX to ODT
            const converted = await this.getConvertDocumentToOdt(file);

            // Convert ODT directly to HTML using LibreOffice CLI
            const html = await this.convertOdtToHtml(converted);

            // Write the HTML to test.html
            const testHtmlPath = join(__dirname, '..', '..', 'test.html');
            await fs.writeFile(testHtmlPath, html);

            // Replace "Terrible" with "Best" and save to test2.html
            const modifiedHtml = html.replace(/Project Description/g, 'Project Description 2');
            const test2HtmlPath = join(__dirname, '..', '..', 'test2.html');
            await fs.writeFile(test2HtmlPath, modifiedHtml);

            // Create temporary directories for input and output
            const tempDir = join(__dirname, '..', 'temp');
            const inputDir = join(tempDir, 'input');
            const outputDir = join(tempDir, 'output');

            // Ensure directories exist
            await fs.mkdir(tempDir, { recursive: true });
            await fs.mkdir(inputDir, { recursive: true });
            await fs.mkdir(outputDir, { recursive: true });

            // Write modified HTML to a temporary file
            const tempHtmlPath = join(inputDir, 'temp.html');
            await fs.writeFile(tempHtmlPath, modifiedHtml);

            // Convert HTML to ODT using LibreOffice CLI
            const outputOdtPath = join(outputDir, 'temp.odt');
            await execPromise(`soffice --headless --convert-to odt --outdir "${outputDir}" "${tempHtmlPath}"`);

            // Read the generated ODT file
            const odtBuffer = await fs.readFile(outputOdtPath);

            // Convert ODT to DOCX
            const docxBuffer = await libreConvert(odtBuffer, '.docx', undefined);

            // Clean up temporary files
            await fs.rm(tempDir, { recursive: true, force: true });

            return {
                success: true,
                html: modifiedHtml,
                docx: docxBuffer
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to modify DOCX through HTML'
            };
        }
    }

    async getConvertDocumentToOdt(file: Express.Multer.File) {
        try {
            const ext = '.odt';
            // First convert DOCX to ODT
            const converted = await new Promise<Buffer>((resolve, reject) => {
                libre.convert(file.buffer, ext, undefined, (err, done) => {
                    if (err) return reject(err);
                    resolve(done);
                });
            });

            return converted;
        } catch (error) {
            throw new Error(`Failed to convert document to ODT: ${error.message}`);
        }
    }

    async processAndExtractContent(file: Express.Multer.File) {
        try {
            const converted = await this.getConvertDocumentToOdt(file);

            // Extract XML content from ODT
            const zip = new JSZip();
            const odtContents = await zip.loadAsync(converted);
            const contentXmlFile = odtContents.file('content.xml');

            if (!contentXmlFile) {
                throw new Error('Could not find content.xml in the ODT file');
            }

            const contentXml = await contentXmlFile.async('string');

            // Write the XML to test.xml
            const testXmlPath = join(__dirname, '..', '..', 'test.xml');
            await fs.writeFile(testXmlPath, contentXml);

            // Replace "Terrible" with "Best" and save to test2.xml
            const modifiedXml = contentXml.replace(/Project Description/g, 'Project Description 2');
            const test2XmlPath = join(__dirname, '..', '..', 'test2.xml');
            await fs.writeFile(test2XmlPath, modifiedXml);

            // Convert modified XML back to DOCX
            const docxBuffer = await this.convertModifiedXmlToDocx(modifiedXml, converted);

            // Convert ODT directly to HTML using LibreOffice CLI
            const html = await this.convertOdtToHtml(converted);

            // Write the HTML to test.html
            const testHtmlPath = join(__dirname, '..', '..', 'test.html');
            await fs.writeFile(testHtmlPath, html);

            return {
                success: true,
                html,
                xml: contentXml,
                docx: docxBuffer
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Unknown error occurred during document processing'
            };
        }
    }
}

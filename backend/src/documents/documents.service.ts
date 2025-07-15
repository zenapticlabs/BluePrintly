import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import * as libre from 'libreoffice-convert';
import * as JSZip from 'jszip';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

const libreConvert = promisify(libre.convert);
const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class DocumentsService {

    async convertDocumentToOdt(file: Express.Multer.File) {
        try {
            const ext = '.odt';
            // First convert DOCX to ODT
            const convertedOdt = await new Promise<Buffer>((resolve, reject) => {
                libre.convert(file.buffer, ext, undefined, (err, done) => {
                    if (err) return reject(err);
                    if (!done) return reject(new Error('Failed to convert document: Output buffer is undefined'));
                    resolve(done);
                });
            });

            // Save the converted ODT file locally
            const outputPath = path.join(__dirname, '..', '..', 'test.odt');
            await writeFileAsync(outputPath, convertedOdt);

            return convertedOdt;
        } catch (error) {
            throw new Error(`Failed to convert document to ODT: ${error.message}`);
        }
    }

    async getXmlFromODT(odtBuffer: Buffer): Promise<string> {
        const zip = new JSZip();
        const odtContents = await zip.loadAsync(odtBuffer);
        const contentXmlFile = odtContents.file('content.xml');
        if (!contentXmlFile) {
            throw new Error('Could not find content.xml in the ODT file');
        }
        return contentXmlFile.async('string');
    }

    async convertXmlToDocument(xml: string, originalOdtBuffer: Buffer): Promise<Buffer> {
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
            zip.file('content.xml', xml);

            // Generate the new ODT buffer
            const newOdtBuffer = await zip.generateAsync({ type: 'nodebuffer' });

            // Convert ODT to DOCX using LibreOffice
            const docxBuffer = await libreConvert(newOdtBuffer, '.docx', undefined);
            if (!docxBuffer) {
                throw new Error('Failed to convert ODT to DOCX: Output buffer is undefined');
            }
            return docxBuffer;
        } catch (error) {
            throw new Error(`Failed to convert modified XML to DOCX: ${error.message}`);
        }
    }

    async parseXmlToJson(xml: string) {
        try {
            const parser = new xml2js.Parser({
                explicitArray: true,
                explicitChildren: true,
                preserveChildrenOrder: true,
                xmlns: true,
                explicitCharkey: true
            });

            const result = await parser.parseStringPromise(xml);

            // Helper function to transform xml2js format to our desired format
            const transformNode = (node: any): any => {
                // If this is a text node
                if (typeof node === 'string') {
                    return { '#text': node };
                }

                const transformed: any = {
                    name: node['#name'],
                    children: []
                };

                // Handle attributes
                const attributes: any = {};
                for (const key in node.$) {
                    attributes[key] = node.$[key];
                }
                if (Object.keys(attributes).length > 0) {
                    transformed.attributes = attributes;
                }

                // Handle children and text nodes
                if (node.$$) {
                    transformed.children = node.$$.map((child: any) => transformNode(child));
                }

                // Handle text content
                if (node._) {
                    transformed.children.push({ '#text': node._ });
                }

                return transformed;
            };

            // Transform the entire document
            const transformedJson = transformNode(result['office:document-content']);

            return transformedJson;
        } catch (error) {
            throw new Error(`Failed to parse XML to JSON: ${error.message}`);
        }
    }

    async processDocument(file: Express.Multer.File) {
        try {
            // First convert DOCX to ODT
            const convertedOdt = await this.convertDocumentToOdt(file);

            // Extract XML content from ODT
            const contentXml = await this.getXmlFromODT(convertedOdt);

            // Convert XML to JSON
            const jsonData = await this.parseXmlToJson(contentXml);

            // Convert modified XML back to DOCX
            const docxBuffer = await this.convertXmlToDocument(contentXml, convertedOdt);

            return {
                success: true,
                xml: contentXml,
                json: jsonData,
                docx: docxBuffer
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Failed to modify DOCX through XML'
            };
        }
    }
}

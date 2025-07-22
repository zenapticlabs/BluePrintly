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
export class ConverterService {
    async convertToOdt(file: Express.Multer.File): Promise<Buffer> {
        try {
            const ext = '.odt';
            // Convert DOCX to ODT
            const convertedOdt = await new Promise<Buffer>((resolve, reject) => {
                libre.convert(file.buffer, ext, undefined, (err, done) => {
                    if (err) return reject(err);
                    if (!done) return reject(new Error('Failed to convert document: Output buffer is undefined'));
                    resolve(done);
                });
            });

            return convertedOdt;
        } catch (error) {
            throw new Error(`Failed to convert document to ODT: ${error.message}`);
        }
    }

    async convertToDocx(odtBuffer: Buffer, xml: string): Promise<Buffer> {
        try {
            // Create a new ZIP with the modified content.xml
            const zip = new JSZip();

            // Load the original ODT to get all other files
            const originalZip = await JSZip.loadAsync(odtBuffer);

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

    async extractXmlFromOdt(odtBuffer: Buffer): Promise<string> {
        const zip = new JSZip();
        const odtContents = await zip.loadAsync(odtBuffer);
        const contentXmlFile = odtContents.file('content.xml');
        if (!contentXmlFile) {
            throw new Error('Could not find content.xml in the ODT file');
        }
        return contentXmlFile.async('string');
    }

    async extractMetadataFromOdt(odtBuffer: Buffer): Promise<any> {
        try {
            const zip = new JSZip();
            const odtContents = await zip.loadAsync(odtBuffer);
            const metaXmlFile = odtContents.file('meta.xml');

            if (!metaXmlFile) {
                throw new Error('Could not find meta.xml in the ODT file');
            }

            const metaXml = await metaXmlFile.async('string');
            const parser = new xml2js.Parser({
                explicitArray: false,
                xmlns: true
            });

            const result = await parser.parseStringPromise(metaXml);
            const metadata = result['office:document-meta']['office:meta'];

            // Helper function to safely extract value from metadata fields
            const getValue = (field: any) => field?._?.toString() || '';
            const getStatValue = (statName: string) =>
                metadata?.['meta:document-statistic']?.$?.[`meta:${statName}`]?.value || '0';

            // Extract user-defined fields into a map
            const userDefinedFields = {};
            if (Array.isArray(metadata['meta:user-defined'])) {
                metadata['meta:user-defined'].forEach(field => {
                    const name = field?.$?.['meta:name']?.value;
                    if (name) {
                        userDefinedFields[name] = getValue(field);
                    }
                });
            }

            return {
                initialCreator: getValue(metadata['meta:initial-creator']),
                creator: getValue(metadata['dc:creator']),
                editingCycles: getValue(metadata['meta:editing-cycles']),
                creationDate: getValue(metadata['meta:creation-date']),
                date: getValue(metadata['dc:date']),
                editingDuration: getValue(metadata['meta:editing-duration']),
                generator: getValue(metadata['meta:generator']),
                statistics: {
                    tableCount: parseInt(getStatValue('table-count')),
                    imageCount: parseInt(getStatValue('image-count')),
                    objectCount: parseInt(getStatValue('object-count')),
                    pageCount: parseInt(getStatValue('page-count')),
                    paragraphCount: parseInt(getStatValue('paragraph-count')),
                    wordCount: parseInt(getStatValue('word-count')),
                    characterCount: parseInt(getStatValue('character-count')),
                    nonWhitespaceCharacterCount: parseInt(getStatValue('non-whitespace-character-count'))
                },
                template: {
                    type: metadata?.['meta:template']?.$?.['xlink:type']?.value || '',
                    actuate: metadata?.['meta:template']?.$?.['xlink:actuate']?.value || '',
                    title: metadata?.['meta:template']?.$?.['xlink:title']?.value || '',
                    href: metadata?.['meta:template']?.$?.['xlink:href']?.value || ''
                },
                userDefined: userDefinedFields
            };
        } catch (error) {
            console.warn('Failed to extract metadata:', error);
            return {};
        }
    }
}
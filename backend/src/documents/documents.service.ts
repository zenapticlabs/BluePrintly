import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import * as libre from 'libreoffice-convert';
import * as JSZip from 'jszip';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

const libreConvert = promisify(libre.convert);
const writeFileAsync = promisify(fs.writeFile);

@Injectable()
export class DocumentsService {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseServiceKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase credentials');
        }

        this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });
    }

    private async uploadToSupabase(buffer: Buffer, fileName: string, bucketName: string): Promise<string> {
        try {
            // First check if the bucket exists, if not create it
            const { data: buckets, error: bucketsError } = await this.supabase
                .storage
                .listBuckets();

            if (bucketsError) throw bucketsError;

            const bucketExists = buckets.some(bucket => bucket.name === bucketName);
            
            if (!bucketExists) {
                const { error: createBucketError } = await this.supabase
                    .storage
                    .createBucket(bucketName, { public: true });
                
                if (createBucketError) throw createBucketError;
            }

            // Upload the file
            const { data, error: uploadError } = await this.supabase.storage
                .from(bucketName)
                .upload(`documents/${fileName}`, buffer, {
                    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get the public URL
            const { data: urlData } = this.supabase.storage
                .from(bucketName)
                .getPublicUrl(`documents/${fileName}`);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Failed to upload file to Supabase: ${error.message}`);
        }
    }

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
                explicitCharkey: true,
                charsAsChildren: true  // This is important for mixed content
            });

            const result = await parser.parseStringPromise(xml);

            // Helper function to transform xml2js format to our desired format
            const transformNode = (node: any): any => {
                // If this is a text node (when charsAsChildren is true)
                if (node['#name'] === '__text__') {
                    return { '#text': node._ };
                }

                // If this is a string (shouldn't happen with our parser config)
                if (typeof node === 'string') {
                    return { '#text': node };
                }

                const transformed: any = {
                    name: node['#name'],
                    children: []
                };

                // Handle attributes
                if (node.$ && Object.keys(node.$).length > 0) {
                    const attributes: any = {};
                    for (const key in node.$) {
                        const attr = node.$[key];
                        // If attribute has namespace info
                        if (typeof attr === 'object' && attr.name) {
                            attributes[key] = attr;
                        } else {
                            // Simple attribute value
                            attributes[key] = {
                                name: key,
                                value: attr,
                                prefix: key.includes(':') ? key.split(':')[0] : '',
                                local: key.includes(':') ? key.split(':')[1] : key,
                                uri: ''  // URI would need to be resolved from namespace
                            };
                        }
                    }
                    transformed.attributes = attributes;
                }

                // Handle children - this now includes both elements and text nodes in order
                if (node.$$) {
                    transformed.children = node.$$.map((child: any) => transformNode(child));
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

    async parseJsonToXml(json: any): Promise<string> {
        try {
            // Helper function to escape XML special characters
            const escapeXml = (text: string): string => {
                return text
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;');
            };

            // Helper function to convert JSON node to XML string
            const nodeToXml = (node: any, indent: string = ''): string => {
                // Handle text nodes
                if (node['#text'] !== undefined) {
                    return escapeXml(node['#text']);
                }

                let xml = '';

                // Start opening tag
                xml += `<${node.name}`;

                // Add attributes
                if (node.attributes) {
                    for (const attrName in node.attributes) {
                        const attr = node.attributes[attrName];
                        xml += ` ${attr.name}="${escapeXml(attr.value)}"`;
                    }
                }

                // Handle empty elements
                if (!node.children || node.children.length === 0) {
                    xml += '/>';
                    return xml;
                }

                // Close opening tag
                xml += '>';

                // Add children
                let hasOnlyTextChildren = node.children.every((child: any) => child['#text'] !== undefined);

                if (hasOnlyTextChildren) {
                    // If only text children, don't add newlines
                    node.children.forEach((child: any) => {
                        xml += nodeToXml(child);
                    });
                } else {
                    // Mixed content or element children
                    node.children.forEach((child: any, index: number) => {
                        if (child['#text'] !== undefined) {
                            // Text node - add without newlines
                            xml += nodeToXml(child);
                        } else {
                            // Element node
                            xml += nodeToXml(child, indent + '  ');
                        }
                    });
                }

                // Add closing tag
                xml += `</${node.name}>`;

                return xml;
            };

            // Start with XML declaration
            let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n';

            // Convert the JSON structure to XML
            xmlString += nodeToXml(json);

            return xmlString;
        } catch (error) {
            throw new Error(`Failed to parse JSON to XML: ${error.message}`);
        }
    }

    async getMetadataFromODT(odtBuffer: Buffer): Promise<any> {
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

    async processDocument(file: Express.Multer.File) {
        try {
            // Upload original file to Supabase
            const originalFileName = `original_${Date.now()}_${file.originalname}`;
            const originalUrl = await this.uploadToSupabase(
                file.buffer,
                originalFileName,
                'documents'
            );

            // First convert DOCX to ODT
            const convertedOdt = await this.convertDocumentToOdt(file);

            // Extract metadata from ODT
            const metadata = await this.getMetadataFromODT(convertedOdt);

            // Extract XML content from ODT
            const contentXml = await this.getXmlFromODT(convertedOdt);

            fs.writeFileSync('content.xml', contentXml);
            // Convert XML to JSON
            const jsonData = await this.parseXmlToJson(contentXml);

            fs.writeFileSync('json.json', JSON.stringify(jsonData, null, 2));

            const processedJson = await this.processJsonByAI(jsonData);

            const modifiedXml = await this.parseJsonToXml(processedJson);

            fs.writeFileSync('modified.xml', modifiedXml);
            // Convert modified XML back to DOCX
            const docxBuffer = await this.convertXmlToDocument(modifiedXml, convertedOdt);

            // Upload modified file to Supabase
            const modifiedFileName = `modified_${Date.now()}_${file.originalname}`;
            const modifiedUrl = await this.uploadToSupabase(
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

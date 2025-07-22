import * as xml2js from 'xml2js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class XmlProcessorService {
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
}
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export interface UploadResponse {
  content: string;
  mimeType?: string;
  messages: Array<{
    type: string;
    message: string;
    size?: number;
    mimetype?: string;
  }>;
}

export interface ResendFileData {
  content: Blob;
  filename: string;
  mimetype: string;
}

export class DocumentService {
  static async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    return response.json();
  }

  static async resendFile(fileData: ResendFileData): Promise<UploadResponse> {
    const formData = new FormData();
    const file = new File([fileData.content], fileData.filename, { type: fileData.mimetype });
    formData.append('file', file);

    const response = await fetch(`${BACKEND_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to resend file: ${response.statusText}`);
    }

    return response.json();
  }

  static async processDocument(file: File, mode: 'XML' | 'HTML' = 'XML'): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    formData.append('download', 'false');

    const response = await fetch(`${BACKEND_URL}/api/documents/process`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to process file: ${response.statusText}`);
    }

    // Check if the response is binary or JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      // Direct binary response
      return response.blob();
    } else {
      // JSON response with base64 docx
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to process document');
      }

      // Convert base64 docx string to Blob
      const byteCharacters = atob(result.docx);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    }
  }
}

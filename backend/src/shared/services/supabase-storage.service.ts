import { Injectable } from '@nestjs/common';
import { BaseSupabaseService } from './base-supabase.service';
import { StorageConfig, BucketName } from '../../config/storage.config';

@Injectable()
export class SupabaseStorageService extends BaseSupabaseService {
    async uploadFile(buffer: Buffer, fileName: string, bucketName: BucketName): Promise<string> {
        try {
            await this.ensureBucketExists(bucketName);

            // Upload the file
            const { data, error: uploadError } = await this.supabase.storage
                .from(bucketName)
                .upload(`${StorageConfig.paths.DOCUMENTS}/${fileName}`, buffer, {
                    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get the public URL
            const { data: urlData } = this.supabase.storage
                .from(bucketName)
                .getPublicUrl(`${StorageConfig.paths.DOCUMENTS}/${fileName}`);

            return urlData.publicUrl;
        } catch (error) {
            console.error('Supabase upload error:', error);
            throw new Error(`Failed to upload file to Supabase: ${error.message}`);
        }
    }

    async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucketName)
                .download(`documents/${fileName}`);

            if (error) throw error;

            // Convert Blob to Buffer
            const arrayBuffer = await data.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (error) {
            console.error('Supabase download error:', error);
            throw new Error(`Failed to download file from Supabase: ${error.message}`);
        }
    }

    private async ensureBucketExists(bucketName: string): Promise<void> {
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
    }
} 
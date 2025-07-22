import { Injectable } from '@nestjs/common';
import { BaseSupabaseService } from './base-supabase.service';

@Injectable()
export class SupabaseStorageService extends BaseSupabaseService {
    async uploadFile(buffer: Buffer, fileName: string, bucketName: string): Promise<string> {
        try {
            await this.ensureBucketExists(bucketName);

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
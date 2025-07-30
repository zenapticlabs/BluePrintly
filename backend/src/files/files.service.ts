import { Injectable } from '@nestjs/common';
import { StorageConfig } from 'src/config/storage.config';
import { BaseSupabaseService } from 'src/shared/services/base-supabase.service';

@Injectable()
export class FilesService extends BaseSupabaseService {

    async uploadFile(file: Express.Multer.File, bucketName: string) {
        await this.ensureBucketExists(bucketName);

        // Generate unique filename using timestamp
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
        const filePath = `${StorageConfig.paths.DOCUMENTS}/${uniqueFileName}`;

        const { data, error } = await this.supabase.storage
            .from(bucketName)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });
        if (error) {
            throw new Error(error.message);
        }

        const { data: urlData } = this.supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

        return {
            url: urlData.publicUrl,
        };
    }

    async downloadFile(bucketName: string, fileName: string) {
        try {
            const { data, error } = await this.supabase.storage
                .from(bucketName)
                .download(`${StorageConfig.paths.DOCUMENTS}/${fileName}`);

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

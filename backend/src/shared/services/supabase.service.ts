import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
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

    // Storage methods
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

    // Auth methods
    async signUp(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    }

    async signOut(token: string) {
        const { error } = await this.supabase.auth.admin.signOut(token);
        if (error) throw error;
    }

    async getUserById(userId: string) {
        const { data, error } = await this.supabase.auth.admin.getUserById(userId);
        if (error) throw error;
        return data;
    }

    // Database methods
    getClient(): SupabaseClient {
        return this.supabase;
    }
} 
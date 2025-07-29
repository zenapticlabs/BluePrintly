export const StorageConfig = {
  buckets: {
    DOCUMENTS: 'documents',
    PAST_PROPOSALS: 'past-proposals',
  },
  paths: {
    DOCUMENTS: 'documents', // subfolder within bucket
  },
} as const;

// Type for bucket names
export type BucketName = typeof StorageConfig.buckets[keyof typeof StorageConfig.buckets]; 
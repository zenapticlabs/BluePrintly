declare module 'libreoffice-convert' {
  interface ConvertOptions {
    format?: string;
    options?: any;
  }

  function convert(
    buffer: Buffer, 
    format: string, 
    options?: ConvertOptions | undefined,
    callback?: (err: Error | null, result?: Buffer) => void
  ): void;

  export { convert };
} 
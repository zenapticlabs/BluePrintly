import { IsArray, IsString, IsUrl } from 'class-validator';

export interface FileInfo {
  url: string;
  originalname: string;
  mimetype: string;
  size: number;
}

export class PastProposalUploadDto {
  @IsArray()
  @IsUrl({}, { each: true })
  urls: string[];

  @IsString()
  userId: string;
} 
import { IsArray, IsString } from 'class-validator';

export class PastProposalUploadDto {
  @IsArray()
  files: Express.Multer.File[];

  @IsString()
  userId: string;
} 
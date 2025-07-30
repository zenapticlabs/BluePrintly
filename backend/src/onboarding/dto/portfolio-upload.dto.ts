import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class FileInfoDto {
  @IsString()
  filename: string;

  @IsString()
  fileUrl: string;

  @IsString()
  fileType: string;

  @IsString()
  fileSize: string;
}

export class PortfolioUploadDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileInfoDto)
  urls: FileInfoDto[];
}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
    const uploadDir = this.configService.get('upload.dir') || './uploads';
    const uploadDirPath = path.resolve(uploadDir);

    if (!fs.existsSync(uploadDirPath)) {
      fs.mkdirSync(uploadDirPath, { recursive: true });
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDirPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const fileSize = file.size;
    const fileType = file.mimetype;

    return {
      id: uuidv4(),
      fileName: file.originalname,
      storedName: fileName,
      filePath: `/uploads/${fileName}`,
      fileSize,
      fileType,
      uploadTime: new Date(),
    };
  }

  async uploadMultipleFiles(files: Express.Multer.File[]): Promise<any[]> {
    const results = [];
    for (const file of files) {
      const result = await this.uploadFile(file);
      results.push(result);
    }
    return results;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.resolve(filePath.replace(/^\//, ''));
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error('Delete file error:', error);
    }
  }
}

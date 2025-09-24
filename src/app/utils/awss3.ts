import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3'
import { AppError } from '../classes/appError';
import config from '../config';
import { TFile } from '../../interface/file.interface';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const s3Client = new S3Client({
  endpoint: config.aws.endpoint,
  region: `${config.aws.region}`,
  credentials: {
    accessKeyId: `${config.aws.accessKeyId}`,
    secretAccessKey: `${config.aws.secretAccessKey}`,
  },
})

export const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb: any) => {
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp', // Image types
      'video/mp4', 'video/webm', 'video/avi', 'video/mkv', 'video/mov',  // Video types
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

//upload a single file
export const uploadToS3 = async (file: TFile): Promise<string> => {
  const fileName = `images/noman/${Date.now()}-${file.originalname}`;
  const localFilePath = path.join(process.cwd(), 'uploads', file.filename);

  const fileStream = fs.createReadStream(localFilePath);

  const command = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: fileName,
    Body: fileStream,
    ContentType: file.mimetype,
    ACL: ObjectCannedACL.public_read, //access public read
  });

  try {
    const key = await s3Client.send(command);
    if (!key) {
      throw new AppError(400, 'File Upload failed');
    }
    const url = `${config?.aws?.s3BaseUrl}/${fileName}`;
    if (!url) throw new AppError(400, 'File Upload failed');

    return url;
  } catch (error) {
    console.log(error);
    throw new AppError(400, 'File Upload failed');
  } finally {
    // fs.unlinkSync(localFilePath);
  }
};

// // delete file from s3 bucket
export const deleteFromS3 = async (url: string) => {
  const key = decodeURIComponent(url.split(".digitaloceanspaces.com/")[1]);

  try {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.bucket,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.log('🚀 ~ deleteFromS3 ~ error:', error);
  }
};

// // upload multiple files

// export const uploadManyToS3 = async (
//   files: {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     file: any;
//     path: string;
//     key?: string;
//   }[],
// ): Promise<{ url: string; key: string }[]> => {
//   try {
//     const uploadPromises = files.map(async ({ file, path, key }) => {
//       const newFileName = key
//         ? key
//         : `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;

//       const fileKey = `${path}/${newFileName}`;

//       const command = new PutObjectCommand({
//         Bucket: config.aws.bucket as string,
//         Key: fileKey,
//         Body: file?.buffer,
//         ContentType: file.mimetype,
//         ACL: ObjectCannedACL.public_read, //access public read
//       });

//       const nn = await s3Client.send(command);
//       console.log('nn', nn);
//       // const url = `${config?.aws?.s3BaseUrl}/${fileKey}`;
//       const url = `${config?.aws?.s3BaseUrl}/${fileKey}`;
//       return { url, key: newFileName };
//     });

//     const uploadedUrls = await Promise.all(uploadPromises);
//     return uploadedUrls;
//   } catch (error: any) {
//     throw new Error(error.message || 'File Upload failed');
//   }
// };

// export const deleteManyFromS3 = async (keys: string[]) => {
//   try {
//     const deleteParams = {
//       Bucket: config.aws.bucket,
//       Delete: {
//         Objects: keys.map(key => ({ Key: key })),
//         Quiet: false,
//       },
//     };

//     const command = new DeleteObjectsCommand(deleteParams);

//     const response = await s3Client.send(command);

//     return response;
//   } catch (error) {
//     console.error('Error deleting S3 files:', error);
//     throw new AppError(400, 'S3 file delete failed');
//   }
// };

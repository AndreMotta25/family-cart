import { AWSError, S3 } from 'aws-sdk';
import { Request } from 'aws-sdk/lib/request';
import { readFile, unlink } from 'fs/promises';
import mime from 'mime';

import { IPhotoProvider, ISaveFile } from '../IPhotoProvider';

class S3PhotoProvider implements IPhotoProvider {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      apiVersion: process.env.S3_API_VERSION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      endpoint: process.env.S3_ENDPOINT as string,
      region: 'us-east-1',
      s3ForcePathStyle: true,
    });
  }

  async saveFile(file: string): Promise<ISaveFile> {
    const buffer = await readFile(file);
    const fileName = file.split('/')[1];
    const mimeType = mime.getType(file);

    const getCid = async (requestS3: Request<S3.PutObjectOutput, AWSError>) => {
      return new Promise((resolve, reject) => {
        requestS3.on('httpHeaders', (statusCode, headers) => {
          const cid = headers['x-amz-meta-cid'];
          resolve(cid);
        });

        requestS3.on('error', (error) => {
          reject(error);
        });

        requestS3.send(); // envia a foto.
      });
    };

    const params = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: fileName as string,
      ContentType: mimeType as string,
      Body: buffer,
      ACL: process.env.S3_ACL,
    };

    const requestS3 = this.s3.putObject(params);
    const cidPhoto = (await getCid(requestS3)) as string;

    await unlink(file); // apaga o arquivo da pasta tmp.

    return { name: fileName, cid: cidPhoto };
  }

  async deleteFile(file: string): Promise<void> {
    this.s3.deleteObject(
      {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: file,
      },
      (e, data) => {
        console.log(e);
        console.log(data);
      },
    );
    console.log('deletando o arquivo', file);
  }
}

export { S3PhotoProvider };

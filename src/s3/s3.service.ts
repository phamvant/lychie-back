import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomBytes } from "crypto";
import https from "https";

@Injectable()
export class S3BucketService {
  constructor(private configService: ConfigService) {}

  static client;

  async onModuleInit() {
    S3BucketService.client = new S3Client({
      region: this.configService.get("aws.region"),
      credentials: {
        accessKeyId: this.configService.get("aws.access_id"),
        secretAccessKey: this.configService.get("aws.secret_key"),
      },
    });
  }

  private async createPresignedUrlWithClient({ region, bucket, key }) {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(S3BucketService.client, command, { expiresIn: 3600 });
  }

  async put(url, data) {
    return new Promise((resolve, reject) => {
      const req = https.request(
        url,
        { method: "PUT", headers: { "Content-Length": new Blob([data]).size } },
        (res) => {
          let responseBody = "";
          res.on("data", (chunk) => {
            responseBody += chunk;
          });
          res.on("end", () => {
            resolve(responseBody);
          });
        }
      );
      req.on("error", (err) => {
        reject(err);
      });
      req.write(data);
      req.end();
    });
  }

  private async getUrl(bucketName: string, fileName: string) {
    const REGION = this.configService.get("aws.region");
    const BUCKET = bucketName;
    const KEY = fileName;

    try {
      const clientUrl = await this.createPresignedUrlWithClient({
        region: REGION,
        bucket: BUCKET,
        key: KEY,
      });

      return clientUrl;
    } catch (err) {
      console.error(err);
    }
  }

  async getImageUploadUrl(productCode: string, volume: number) {
    const uploadUrl = [];

    while (volume > 0) {
      const rawBytes = randomBytes(16);
      const imageName = `${productCode.toString()}/` + rawBytes.toString("hex");

      const url = await this.getUrl("lychiebucket", imageName);
      uploadUrl.push(url);
      volume = volume - 1;
    }

    return uploadUrl;
  }

  async getObjectsListObjects(productCode: string, bucket = "lychiebucket") {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      MaxKeys: 10,
      Prefix: productCode,
    });

    const response = await S3BucketService.client.send(command);

    return response.Contents?.map((object) => {
      return { Key: object.Key };
    });
  }

  async deleteImageFolder(productCode: string) {
    const BUCKET = "lychiebucket";

    const objectsKey = (await this.getObjectsListObjects(
      productCode,
      BUCKET
    )) as any;

    if (!objectsKey) {
      return false;
    }

    const command = new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: objectsKey,
      },
    });

    const response = await S3BucketService.client.send(command);

    return { response };
  }

  // async getAll() {
  //   const BUCKET = "lychiebucket";
  //   const command = new ListObjectsV2Command({
  //     Bucket: BUCKET,
  //     MaxKeys: 100,
  //   });

  //   console.log(BUCKET);

  //   const res = await S3BucketService.client.send(command);

  //   // const arr = res.Contents.map((content) => {
  //   //   return !content.Key.includes("")
  //   // });

  //   const aa = res.Contents.map((aa) => {
  //     if (!aa.Key.includes(".jpg")) {
  //       return { Key: aa.Key };
  //     }
  //   });

  //   const a = aa.filter((v) => v != null);

  //   // const arr = a.filter((content) => !content.includes(".jpg"));

  //   // for (const name of arr) {
  //   //   let input = {
  //   //     Bucket: BUCKET,
  //   //     CopySource: `/${BUCKET}/${name}`,
  //   //     Key: name + ".jpg",
  //   //   };
  //   //   let command = new CopyObjectCommand(input);
  //   //   let response = await S3BucketService.client.send(command);
  //   //   console.log(response);
  //   // }

  //   const input = {
  //     Bucket: BUCKET,
  //     Delete: {
  //       Objects: a,
  //       Quiet: false,
  //     },
  //   };
  //   const command2 = new DeleteObjectsCommand(input);
  //   const response = await S3BucketService.client.send(command2);

  //   return response
  // }
}

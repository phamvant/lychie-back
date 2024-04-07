import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromIni } from "@aws-sdk/credential-providers";
import {
  S3RequestPresigner,
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";
import { formatUrl } from "@aws-sdk/util-format-url";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Hash } from "@smithy/hash-node";
import { HttpRequest } from "@smithy/protocol-http";
import { parseUrl } from "@smithy/url-parser";
import { randomBytes } from "crypto";
import https from "https";

@Injectable()
export class S3BucketService {
  constructor(private configService: ConfigService) {}

  private async createPresignedUrlWithoutClient({ region, bucket, key }) {
    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
    const presigner = new S3RequestPresigner({
      credentials: fromIni(),
      region,
      sha256: Hash.bind(null, "sha256"),
    });

    const signedUrlObject = await presigner.presign(
      new HttpRequest({ ...url, method: "PUT" })
    );
    return formatUrl(signedUrlObject);
  }

  private async createPresignedUrlWithClient({ region, bucket, key }) {
    const client = new S3Client({ region });
    const command = new PutObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
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

  async getImageUploadUrl(productName: string, volume: number) {
    const uploadUrl = [];

    while (volume > 0) {
      const rawBytes = randomBytes(16);
      const imageName = `${productName.toString()}/` + rawBytes.toString("hex");

      const url = await this.getUrl("lychiebucket", imageName);
      uploadUrl.push(url);
      volume = volume - 1;
    }

    return uploadUrl;
  }
}

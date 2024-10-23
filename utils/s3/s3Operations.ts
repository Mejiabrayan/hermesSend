import { ListBucketsCommand, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import s3Client from "./s3Client";

export async function listBuckets() {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    return data.Buckets;
  } catch (err) {
    console.error("Error", err);
  }
}

export async function listObjects(bucket: string) {
  try {
    const data = await s3Client.send(new ListObjectsV2Command({ Bucket: bucket }));
    return data.Contents;
  } catch (err) {
    console.error("Error", err);
  }
}

export async function getObject(bucket: string, key: string) {
  try {
    const data = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    return data.Body;
  } catch (err) {
    console.error("Error", err);
  }
}

export async function putObject(bucket: string, key: string, body: Uint8Array | string) {
  try {
    const data = await s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: body }));
    return data;
  } catch (err) {
    console.error("Error", err);
  }
}

export async function getPresignedUrlForDownload(bucket: string, key: string, expiresIn: number = 3600) {
  try {
    return await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn }
    );
  } catch (err) {
    console.error("Error", err);
  }
}

export async function getPresignedUrlForUpload(bucket: string, key: string, expiresIn: number = 3600) {
  try {
    return await getSignedUrl(
      s3Client,
      new PutObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn }
    );
  } catch (err) {
    console.error("Error", err);
  }
}

export async function uploadLargeFile(bucket: string, key: string, body: ReadableStream) {
  try {
    const upload = new Upload({
      client: s3Client,
      params: { Bucket: bucket, Key: key, Body: body },
    });

    upload.on("httpUploadProgress", (progress) => {
      console.log(progress);
    });

    return await upload.done();
  } catch (err) {
    console.error("Error", err);
  }
}

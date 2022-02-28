import express from "express";
import env from "../../environment";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const app = express.Router();
const client = new S3Client({ region: env.aws_s3.region });

app.get('/', async (req, res) => {
  const command = new ListBucketsCommand({});
  const response = await client.send(command);  

  res.json(response);
});

export default app;
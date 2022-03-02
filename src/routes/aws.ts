import express from "express";
import multer from "multer";
import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import env from "../../environment";

const app = express.Router();
const client = new S3Client({ region: env.aws_s3.region });
const upload = multer({})

app.get('/buckets', async (req, res) => {
  const command = new ListBucketsCommand({});
  const response = await client.send(command);  

  res.json(response);
});

app.post('/upload-file', upload.single('file'), async (req, res) => {
  // Request body: Form
  // Fields: path (dir/subdir/etc), title (unique), file (uploaded file)
  if (!req.body.path || !req.body.title || !req.file) return res.status(400).json('Invalid request');
  let response;
  try {
    const data = { Bucket: env.aws_s3.bucket, Key: `${req.body.path}/${req.body.title}`, Body: req.file.buffer };
    const command = new PutObjectCommand(data)
    response = await client.send(command);
  } catch (error) {
    console.log(error);
  }
  res.json({ message: 'File uploaded successfully', uri: `${env.aws_s3.uri}/${req.body.path}/${req.body.title}` });
});

export default app;
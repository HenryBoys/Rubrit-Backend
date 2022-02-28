import dotenv from "dotenv";

dotenv.config();
const env: string = process.env.NODE_ENV || 'development';

const envConfig = {
  development: {
    aws_s3: {
      region: process.env.AWS_S3_REGION
    }
  },
  production: {
    aws_s3: {
      region: process.env.AWS_S3_REGION
    }
  }
}[env];

export default envConfig;
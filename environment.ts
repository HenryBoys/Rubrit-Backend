import dotenv from "dotenv";

dotenv.config();
const env: string = process.env.NODE_ENV || 'development';

const envConfig = {
  development: {
    aws_s3: {
      region: process.env.AWS_S3_REGION
    },
    google: {
      maps_api_key: process.env.GOOGLE_MAPS_API_KEY
    }
  },
  production: {
    aws_s3: {
      region: process.env.AWS_S3_REGION
    },
    google: {
      maps_api_key: process.env.GOOGLE_MAPS_API_KEY
    }
  }
}[env];

export default envConfig;
import dotenv from "dotenv";

dotenv.config();
const env: string = process.env.NODE_ENV || "development";

const envConfig = {
  development: {
    aws_s3: {
      region: process.env.AWS_S3_REGION,
      bucket: process.env.AWS_S3_DEVELOPMENT_BUCKET,
      uri: `https://${process.env.AWS_S3_DEVELOPMENT_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`,
    },
    google: {
      maps_api_key: process.env.GOOGLE_MAPS_API_KEY,
    },
    mercado_pago: {
      access_token: process.env.MP_ACCESS_TOKEN,
      preapproval_plan: process.env.MP_PREAPPROVAL_PLAN,
    },
  },
  production: {
    aws_s3: {
      region: process.env.AWS_S3_REGION,
      bucket: process.env.AWS_S3_PRODUCTION_BUCKET,
      uri: `https://${process.env.AWS_S3_PRODUCTION_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`,
    },
    google: {
      maps_api_key: process.env.GOOGLE_MAPS_API_KEY,
    },
    mercado_pago: {
      access_token: process.env.MP_ACCESS_TOKEN,
      preapproval_plan: process.env.MP_PREAPPROVAL_PLAN,
    },
  },
}[env];

export default envConfig;

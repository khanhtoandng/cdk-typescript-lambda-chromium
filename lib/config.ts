import * as dotEnv from 'dotenv'

dotEnv.config()

export class Config {
  private region: string

  private s3BucketArn: string
  private s3BucketName: string
  private chromiumLayerArn: string

  constructor() {
    this.region = process.env.AWS_DEFAULT_REGION as string

    this.s3BucketArn = process.env.S3_BUCKET_ARN as string
    this.s3BucketName = process.env.S3_BUCKET_NAME as string

    this.chromiumLayerArn = process.env.CHROMIUM_LAMBDA_LAYER_ARN as string
  }

  getRegion(): string {
    return this.region
  }

  getS3BucketArn(): string {
    return `arn:aws:s3:::${this.s3BucketName}`
  }

  getS3BucketName(): string {
    return this.s3BucketName
  }

  getChromiumLayerArn(): string {
    return this.chromiumLayerArn
  }

  private capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

export const config = new Config()

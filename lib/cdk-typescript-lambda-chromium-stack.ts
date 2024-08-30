import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as iam from 'aws-cdk-lib/aws-iam'
import { config } from './config'

export class CdkTypescriptLambdaChromiumStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Fetching chromium layer
    const chromiumLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      'chromiumLayerStack',
      config.getChromiumLayerArn()
    )

    // Define aws lambda function
    const lambdaFunction = new lambda.Function(this, 'lambdaNodeStack', {
      code: lambda.Code.fromAsset('src/generating-pdf/lib'),
      functionName: `generatingPdfLambda`,
      handler: 'index.handler',
      memorySize: 1024,
      runtime: lambda.Runtime.NODEJS_18_X,
      description: 'Convert html to PDF for users to download',
      environment: {
        REGION: config.getRegion(),
      },
      timeout: cdk.Duration.seconds(300),
      layers: [chromiumLayer],
    })

    // Grant lambda permission to access s3 bucket
    const bucketArn = config.getS3BucketArn()

    lambdaFunction.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:GetObject', 's3:ListBucket', 's3:PutObject'],
        resources: [bucketArn, `${bucketArn}/*`],
      })
    )

    // Define the function url for lambda
    const myFunctionUrl = lambdaFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
      },
    })

    new cdk.CfnOutput(this, 'LambdaNodeUrl', {
      value: myFunctionUrl.url,
    })
  }
}

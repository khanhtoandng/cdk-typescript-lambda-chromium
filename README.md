# CDK TypeScript Lambda with Chromium project

## Project Setup

The project has a Lambda function - Generating PDF. It is located in /src folder. The build script generates JS files and copies node_modules with only production dependencies to src/{LAMBDA_DIRCTORY}/lib.

The `cdk.json` file tells the CDK Toolkit how to execute this app.

`lib/cdk-typescript-lambda-chromium-stack.ts` defines Lambda function stack.

`lib/config.ts` defines how to load environment variables.

Individual Lambda functions are in `src` folder. Each Lambda project is set up as an independent NodeJS project.

`src/{LAMBDA_NAME}` contains individual Lambda code. TypeScript files are compiled in `/lib` directory. `package.json` file in each Lambda project contains thress scripts -

- `prebuild` - Runs `npm install` before build
- `build` - Compiles TyeScript code in `/lib` directory.
- `package` - Updates `node_modules` directory to remove all dev dependencies and then copies the updated `node_modules` to `/lib`

After `package` runs, `/lib` will have the JS files and dependencies needed to publish Lambda function to AWS.

## Steps to set up

### Prerequisites

1. Access to an AWS account using both AWS Console and AWS CLI V2. Instructions to configure AWS CLI V2 are available [here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html).
2. AWS CDK is setup. The instructions are available [here](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install).
3. NodeJS is installed. Download latest version from [here](https://nodejs.org/en/download/).
4. Git is installed (to pull code from repository). The instructions are available [here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).
5. VS Code or any other IDE for TypeScript development.

### Install and Deploy

From project root directory, run following commands -

- `npm install`
- `npm run build`
- `npm run package`
- `cdk synth`
- `cdk bootstrap`
- `cdk deploy`

## Useful commands

### Customized Commands

- `npm run build` Builds CDK TypeScript, all Lambda functions under /src and updates each functions /lib directory with node_modules
- `npm run lint` runs ESLint validation on entire project, including all Lambda applications
- `npm run format` runs Prettier to format all TypeScript code - CDK and Lambda applications.

### Commands available out of box with CDK.

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## References

[CDK Typescript Lambda](https://github.com/aws-samples/cdk-typescript-lambda)

[AWS CDK Developer Guide](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

[Creating a serverless application using the AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/serverless_example.html)

# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Set up commands
```
npm install -g aws-cdk
```
docker build -t <AWS_ACCOUNT_ID>.dkr.ecr.<リージョン>.amazonaws.com/<ECRリポジトリ名>:latest .
docker push <AWS_ACCOUNT_ID>.dkr.ecr.<リージョン>.amazonaws.com/<ECRリポジトリ名>:latest

docker build -t 847790860507.dkr.ecr.ap-northeast-1.amazonaws.com/its-training-frontend:latest .
docker push 847790860507.dkr.ecr.ap-northeast-1.amazonaws.com/its-training-frontend:latest
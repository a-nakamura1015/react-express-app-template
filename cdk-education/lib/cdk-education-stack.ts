import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { ApplicationProtocol } from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";
import { Ecr } from "./constructs/ecr";
import { Vpc } from "./constructs/vpc";
import { Alb } from "./constructs/alb";
import { Ecs } from "./constructs/ecs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkEducationStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: StackProps,
    readonly resourceName = "sample-node-app"
  ) {
    super(scope, id, props);

    const ecrBackend = new Ecr(this, "EcrBackend", "backend");
    const ecrFrontend = new Ecr(this, "EcrFrontEnd", "frontend");

    const vpc = new Vpc(this, "Vpc");

    const alb = new Alb(this, "Alb", {
      vpc: vpc.resource,
    });

    // NOTE: ECSのフロントエンドサービスを作成
    const ecsFrontend = new Ecs(this, "EcsFrontend", {
      vpc: vpc.resource,
      repository: ecrFrontend.repository,
      connections: {
        alb: alb.connectableInstance,
        //rds: rds.connectableInstance,
      },
      //secrets: rds.secrets,
      port: 80,
    });

    // NOTE: ターゲットグループにタスクを追加
    alb.listener.addTargets("EcsFrontend", {
      port: 80,
      targets: [ecsFrontend.loadBalancerTarget],
      healthCheck: {
        path: "/",
        interval: Duration.minutes(1),
      },
    });

    // NOTE: ECSのバックエンドサービスを作成
    const ecsBackend = new Ecs(this, "EcsBackend", {
      vpc: vpc.resource,
      repository: ecrBackend.repository,
      connections: {
        alb: alb.connectableInstance,
        //rds: rds.connectableInstance,
      },
      //secrets: rds.secrets,
      port: 5000,
    });

    // バックエンド用の ALB リスナーを追加
    const backendListener = alb.alb.addListener("BackendListener", {
      port: 8080,
      protocol: ApplicationProtocol.HTTP,
      open: true,
  });

  backendListener.addTargets("EcsBackendTargets", {
      port: 5000,               // ECS タスク側のポート
      protocol: ApplicationProtocol.HTTP,
      targets: [ecsBackend.loadBalancerTarget],
      healthCheck: {
        path: "/health",
        interval: Duration.minutes(1),
      },
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkEducationQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
